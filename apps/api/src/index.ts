import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import supportRouter from "./routes/support";

const app = express();
const PORT = Number(process.env.API_PORT ?? 5000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "customer-support-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/support", supportRouter);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
