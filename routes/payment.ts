// routes/payment.ts
import express from "express";
import { createStripeSession } from "../controllers/paymentController";

const router = express.Router();

router.post("/stripe/create-session", createStripeSession);

export default router;

