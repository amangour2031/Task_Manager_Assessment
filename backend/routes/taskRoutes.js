import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createTask
);

router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectTasks
);

router.patch(
  "/:taskId/status",
  authMiddleware,
  updateTaskStatus
);

router.delete(
  "/:taskId",
  authMiddleware,
  deleteTask
);

export default router;