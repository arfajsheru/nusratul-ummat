import { Router } from "express";
import {
  createCharityDistributionController,
  getAllVendorCharityController,
  getVendorCharitySummaryController,
  updateCharityDistributionController,
} from "../controllers/charity.controllers.js";

const router = Router();

router.post("/create-charity", createCharityDistributionController);
router.get("/vendor-charity/:vendorId", getAllVendorCharityController);
router.patch("/update-charity", updateCharityDistributionController);
router.get(
  "/vendor-charity-summary/:vendorId",
  getVendorCharitySummaryController,
);
export default router;
