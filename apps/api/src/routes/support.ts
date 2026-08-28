import { Router } from "express";

const router = Router();

router.get("/tickets", async (_req, res) => {
  // TODO: Read tickets from PostgreSQL.
  res.json([]);
});

router.post("/tickets", async (req, res) => {
  // TODO: Validate request and create a support ticket.
  res.status(201).json({ message: "Ticket endpoint placeholder", data: req.body });
});

export default router;
