import { Router } from "express";
import { createManualDonationController } from "../controllers/donation.controller.js";

const router = Router();

router.post("/manual-donation", createManualDonationController);

export default router;