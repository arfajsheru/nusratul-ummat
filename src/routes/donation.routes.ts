import { Router } from "express";
import { createManualDonationController, getVendorMonthlyStatsController } from "../controllers/donation.controller.js";

const router = Router();

router.post("/manual-donation", createManualDonationController);
router.get(
  "/vendor/:vendorId/monthly-stats",
  getVendorMonthlyStatsController
);
export default router;