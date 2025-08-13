import { Router } from "express";
import { healthcheck } from "../controllers/healthchecker.js";

const router = Router()

router.route("/").get(healthcheck)
router.route("/test").get(healthcheck)

export default router  