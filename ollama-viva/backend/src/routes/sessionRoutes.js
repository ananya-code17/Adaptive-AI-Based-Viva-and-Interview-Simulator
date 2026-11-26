import { Router } from "express";
import {
  startSession,
  submitAnswer,
  getSessionDetails
} from "../controllers/sessionController.js";

const router = Router();

router.post("/start", startSession);
router.post("/:id/answer", submitAnswer);
router.get("/:id", getSessionDetails);

export default router;
