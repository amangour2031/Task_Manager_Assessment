import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createProject,
  getUserProjects,
  addMember,
  removeMember,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createProject
);

router.get(
  "/",
  authMiddleware,
  getUserProjects
);

router.post(
  "/:projectId/members",
  authMiddleware,
  addMember
);

router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  removeMember
);

export default router;

