import { Router } from "express";
import {
  isAllowed,
  loginUserHandler,
  userRegisterHandler,
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/isAuthenticated.js";

const router = Router();

router.route("/register").post(userRegisterHandler);
router.route("/login").post(loginUserHandler);
router.route("/protected").post(authenticateJWT, isAllowed);

export default router;
