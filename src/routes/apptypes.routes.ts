import { Router } from "express";
import {
  createUserTypeController,
  getAllUserTypesController,
} from "../controllers/apptypes.controllers.js";

const router = Router();

router.post("/createusertype", createUserTypeController);
router.get("/getallusertype", getAllUserTypesController);

export default router;