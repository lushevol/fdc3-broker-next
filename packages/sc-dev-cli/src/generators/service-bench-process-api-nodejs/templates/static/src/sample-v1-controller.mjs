import { Router } from "express";
import helloWorld from "./actions/hello-world.mjs";

const router = Router();
router.get("/hello-world", helloWorld);

export default router;
