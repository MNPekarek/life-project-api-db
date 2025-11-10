import express from "express";
import { getDashboardStats, getWeeklySales } from "../controllers/stats.controller.js";

const statsRouter = express.Router();

statsRouter.get("/dashboard", getDashboardStats);
statsRouter.get("/weekly-sales", getWeeklySales);

export default statsRouter;