import { Router } from "express";
import process from "node:process";

const router = Router();

router.get("/env", async (req, res) => {
  const processEnv = {};
  Object.entries(process.env).forEach(([key, value]) => {
    if (key.includes("PWD") || key.includes("PASS")) {
      processEnv[key] = "********";
    } else {
      processEnv[key] = value;
    }
  });
  res.send(processEnv);
});

export default router;
