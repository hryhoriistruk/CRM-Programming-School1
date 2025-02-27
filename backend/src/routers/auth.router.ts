import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middlewares";
import { ManagerValidator } from "../validators/manager.validator";

const router = Router();

router.post(
  "/login",
  commonMiddleware.isValidBody(ManagerValidator.login),
  authController.signIn,
);

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post(
  "/checkToken",
  authMiddleware.checkAccessToken,
  authController.checkToken,
);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

export const authRouter = router;
