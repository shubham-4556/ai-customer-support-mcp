import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { pool } from "../config/database";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret-change-in-production";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

async function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId, type: "refresh" }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, refreshTokenHash, expiresAt]
  );

  return { accessToken, refreshToken };
}

async function verifyRefreshToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== "refresh") return null;

    const result = await pool.query(
      `SELECT id, user_id, token_hash, expires_at, revoked_at FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW() AND revoked_at IS NULL`,
      [payload.userId]
    );

    for (const row of result.rows) {
      const isValid = await bcrypt.compare(token, row.token_hash);
      if (isValid) {
        return { userId: row.user_id, tokenId: row.id };
      }
    }
    return null;
  } catch {
    return null;
  }
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at`,
      [name, email, passwordHash]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query(`SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await pool.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [user.id]);

    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; type: string };
      if (payload.type === "refresh") {
        await pool.query(
          `UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
          [payload.userId]
        );
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const verified = await verifyRefreshToken(refreshToken);
    if (!verified) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    await pool.query(`UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1`, [verified.tokenId]);

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(verified.userId);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const result = await pool.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND is_active = true`,
      [payload.userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;