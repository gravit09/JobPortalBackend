import { Router } from "express";
import {
  createOrgHandler,
  getAllOrgs,
  getYourOrg,
} from "../controllers/org.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";
import { isOrg } from "../middlewares/isOrg.js";

const router = Router();

router.route("/create").post(authenticateJWT, createOrgHandler);
router.route("/getall").get(getAllOrgs);
router.route("/yourorg").get(authenticateJWT, isOrg, getYourOrg);
export default router;
