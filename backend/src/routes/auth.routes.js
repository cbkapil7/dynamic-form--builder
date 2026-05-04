import express from "express";
import { registerController,loginController,meController } from "../controllers/auth.controller.js";
import { logoutController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", authenticate, logoutController);
router.get("/me", meController);

export default router;