import { Router } from "express";

const router = Router();

// TODO: Add register/login endpoints.
// TODO: Hash passwords with bcrypt.
// TODO: Generate and verify JWT tokens.

router.post("/register", async (_req, res) => {
  res.status(501).json({ message: "Register endpoint not implemented yet." });
});

router.post("/login", async (_req, res) => {
  res.status(501).json({ message: "Login endpoint not implemented yet." });
});

export default router;
