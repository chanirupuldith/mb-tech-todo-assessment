import { Router } from "express";
import {
  createTask,
  getTasks,
  completeTask
} from "../controllers/taskController";

const router = Router();

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id/complete", completeTask);

export default router;