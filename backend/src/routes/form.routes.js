import express from "express";
import { createFormController, getFormsController, getFormController, updateFormController, submitFormController, getMyResponseController } from "../controllers/form.controller.js";
import { authenticate, isAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createFormSchema } from "../validators/form.schema.js";

const router = express.Router();

router.post("/", authenticate, isAdmin, validate(createFormSchema), createFormController);
router.get("/", authenticate, getFormsController);
router.get("/:id", getFormController);
router.put("/:id", authenticate, isAdmin, validate(createFormSchema), updateFormController);
router.post("/:id/submit", authenticate, submitFormController);
router.get("/:id/responses", authenticate, getMyResponseController);

export default router;