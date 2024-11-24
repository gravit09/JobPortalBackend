import { Router } from "express";
import {
  getAllJobHandler,
  getOrgJobListings,
  listJobHandler,
} from "../controllers/job.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";

const router = Router();

router.route("/listjob").post(authenticateJWT, listJobHandler);
router.route("/alljobs").get(getAllJobHandler);
router.route("/orgjobs").get(authenticateJWT, getOrgJobListings);

export default router;
