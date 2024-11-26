import { Router } from "express";
import {
  applyJob,
  getAppliedJobs,
  isAllowed,
  loginUserHandler,
  userRegisterHandler,
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";

const router = Router();

router.route("/register").post(userRegisterHandler);
router.route("/login").post(loginUserHandler);
router.route("/protected").post(authenticateJWT, isAllowed);
router.route("/apply").post(authenticateJWT, applyJob);
router.route("/applied").get(authenticateJWT, getAppliedJobs);

export default router;
