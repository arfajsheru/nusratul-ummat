import { Router } from "express";
import {
  createVendorController,
  getAllVendorUsersController,
  getPendingVendorMembersController,
  getVendorByIdController,
} from "../controllers/vendor.controllers.js";

const router = Router();

/* ============================================================
   VENDOR ROUTES
============================================================ */

router.post("/create", createVendorController);
router.get("/vendordetails/:id", getVendorByIdController);
router.get("/vendorId/:vendorId/users", getAllVendorUsersController);
router.get("/vendorId/:vendorId/pending-members", getPendingVendorMembersController);
export default router;