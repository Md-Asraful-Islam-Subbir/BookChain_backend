import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import WishList from "../models/WishList";

export const addToWishList = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId} = req.body;

    const product = await Products.findById(productId);
    if (!product) {
      return response(res, 404, "Product not found");
    }
    let wishList = await WishList.findOne({ user: userId });
    if (!wishList) {
      wishList = new WishList({ user: userId, items: [] });
    }
if(!wishList.products.includes(productId)){
    wishList.products.push(productId);
    await wishList.save();
}
    await wishList.save();

    return response(res, 200, "Product added to wishlist successfully", wishList);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const removeFromWishList = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId} = req.params;

    let wishList = await WishList.findOne({ user: userId });
    if (!wishList) {
      return response(res, 404, "WishList is not found for this user");
    }
    wishList.products=wishList.products.filter((id)=>id.toString()!==productId)
    await wishList.save();

    return response(res, 200, "Product removed to wishList successfully", wishList);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const getWishListByUser = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;

    let wishList = await WishList.findOne({ user: userId }).populate('products');
    if (!wishList) {
      return response(res, 404, "Product is empty",{Products:[]});
    }
    await wishList.save();

    return response(res, 200, "User wishList get successfully", wishList);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};