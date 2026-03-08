import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import appTypesRoutes from "./routes/apptypes.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import charityRoutes from "./routes/charity.routes.js"
// import campaignRoutes from "./routes/campaign.routes.js";
import donationRoutes from "./routes/donation.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/types", appTypesRoutes);
router.use("/vendor", vendorRoutes);
// router.use("/campaign", campaignRoutes);
router.use("/donation", donationRoutes);
router.use("/charity", charityRoutes);

export default router;
