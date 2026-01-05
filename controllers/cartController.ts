import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICartItem } from "../models/CartItems";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    const product = await Products.findById(productId);
    if (!product) {
      return response(res, 404, "Product not found");
    }

    if (product.seller.toString() === userId) {
      return response(res, 400, "You cannot add your product to the cart");
    }

    let cart = await CartItems.findOne({ user: userId });
    if (!cart) {
      cart = new CartItems({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
     const newItem={
        product:productId,
        quantity:quantity
     }
     cart.items.push(newItem as ICartItem)
    }

    await cart.save();

    return response(res, 200, "Product added to cart successfully", cart);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};
