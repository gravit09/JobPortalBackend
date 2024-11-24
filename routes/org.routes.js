import { Router } from "express";
import {
  createOrgHandler,
  getAllOrgs,
  getYourOrg,
  isOrg,
} from "../controllers/org.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";

const router = Router();

router.route("/create").post(authenticateJWT, createOrgHandler);
router.route("/getall").get(getAllOrgs);
router.route("/yourorg").get(authenticateJWT, getYourOrg);
router.route("/isOrg").get(authenticateJWT, isOrg);
export default router;
