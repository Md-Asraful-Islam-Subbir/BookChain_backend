import { Request, Response } from "express";

export const createProduct = (req: Request, res: Response) => {
    try {
        const { title, category, condition, classType, subject, images, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;

    } catch (error) {

    }
}