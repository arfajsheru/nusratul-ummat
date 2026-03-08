import express from "express";
import cors from "cors";
import routes from "./index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Donation API is running 🚀",
  });
});


// All Routes
app.use("/api", routes);
app.use(errorHandler);

export default app;
