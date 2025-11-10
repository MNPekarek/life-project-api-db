import express from "express";
import { getDashboardStats } from "../controllers/stats.controller.js";

const statsRouter = express.Router();

statsRouter.get("/dashboard", getDashboardStats);

export default statsRouter;