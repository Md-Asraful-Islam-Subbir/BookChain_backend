// controllers/paymentController.ts
import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createStripeSession = async (req: Request, res: Response) => {
  try {
    const { orderId, totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: totalAmount * 100, // Stripe works in paisa
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: {
        orderId,
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    res.status(500).json({
      success: false,
      message: "Payment session creation failed",
    });
  }
};
