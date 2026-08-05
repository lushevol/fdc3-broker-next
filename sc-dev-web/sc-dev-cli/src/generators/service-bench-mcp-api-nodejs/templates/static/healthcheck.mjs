import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  res.send({ status: "UP" });
});

router.get("/live", async (req, res) => {
  res.send({ status: "UP" });
});

router.get("/ready", async (req, res) => {
  res.send({ status: "UP" });
});

export default router;
