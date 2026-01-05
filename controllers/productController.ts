import { Request, Response } from "express";
import { uploadToCloudinary } from "../config/cloudnaryConfig";
import { response } from "../utils/responseHandler";
import Products from "../models/Products";


export const createProduct = async (req: Request, res: Response) => {

  try {
    const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;
    const sellerId = req.id
    const images = req.files as Express.Multer.File[];
    if (images.length === 0 || !images) {
      return res.status(400).json({ message: 'Image is required' });
    }

    let parsedPaymentsDetails = JSON.parse(paymentDetails);

    if (paymentMode === 'ssl' && (!parsedPaymentsDetails || !parsedPaymentsDetails.upiId)) {
      return res.status(400).json({ message: 'UPI ID is required for payment' });
    }

    if (paymentMode === 'Bank Account' &&
      (!parsedPaymentsDetails || !parsedPaymentsDetails.bankDetails ||
        !parsedPaymentsDetails.bankDetails.accountNumber ||
        !parsedPaymentsDetails.bankDetails.ifscCode ||
        !parsedPaymentsDetails.bankDetails.bankName)) {
      return res.status(400).json({ message: 'Bank Account details is required for payment' });
    }
    const uploadPromise = images.map(file => uploadToCloudinary(file as any));
    const uploadImages = await Promise.all(uploadPromise)
    const imageUrl = uploadImages.map(Image => Image.secure_url)

    const product = new Products({
      title, description, subject, category, condition, classType, price, finalPrice, shippingCharge, paymentMode,
      paymentDetails: parsedPaymentsDetails,
      author, edition,
      seller: sellerId, images: imageUrl
    })
    await product.save();
    return response(res, 200, 'Product created successfully', product)
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.find().sort({ createdAt: -1 }).populate('seller', 'name email')
    return response(res, 200, 'Product fetched successfully', products)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Products.findById(req.params.id)
      .populate({
        path: "seller",
        select: "name email profilePicture phoneNumber addresses",
        populate: {
          path: "addresses",
          model: "Address",
        },
      });

    if (!product) {
      return response(res, 404, "Product not found for this id ");
    }

    return response(res, 200, "Products fetched Successfully", product);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.productId)
    return response(res, 200, 'Product fetched successfully', product)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}

export const getProductBySellerId = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return response(res, 400, "Seller not found for this seller");
    }
    const product = await Products.find({seller:sellerId}).sort({ createdAt: -1 }).populate('seller', 'name email profilePicture phoneNumber addresses')

    if (!product) {
      return response(res, 404, "Product not found for this id ");
    }

    return response(res, 200, "Products fetched by seller id Successfully", product);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};