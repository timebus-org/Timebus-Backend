import express from "express";
import { createCabRequest } from "../controllers/cabController.js";

const router = express.Router();

// CREATE CAB REQUEST
router.post("/request", createCabRequest);

export default router;
