import { Router } from "express";
import {
  deleteAnJob,
  getAllJobHandler,
  getOrgJobListings,
  listJobHandler,
} from "../controllers/job.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";

const router = Router();

router.route("/listjob").post(authenticateJWT, listJobHandler);
router.route("/alljobs").get(getAllJobHandler);
router.route("/orgjobs").get(authenticateJWT, getOrgJobListings);
router.route("/deletejob").post(authenticateJWT, deleteAnJob);

export default router;
