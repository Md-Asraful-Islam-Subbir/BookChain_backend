import { Request, Response } from "express";
import { uploadToCloudinary } from "../config/cloudnaryConfig";
import { response } from "../utils/responseHandler";
import Products from "../models/Products";


export const createProduct = async (req: Request, res: Response) => {
  
  try {
    const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;
const sellerId=req.id
  const images = req.files as Express.Multer.File[];
  if (images.length === 0||!images) {
    return res.status(400).json({ message: 'Image is required' });
  }

  let parsedPaymentsDetails = JSON.parse(paymentDetails);

    if (paymentMode === 'ssl' && (!parsedPaymentsDetails||!parsedPaymentsDetails.upiId)) { 
        return res.status(400).json({ message: 'UPI ID is required for payment' });
    }

    if (paymentMode === 'Bank Account' && 
      (!parsedPaymentsDetails||!parsedPaymentsDetails.bankDetails ||
          !parsedPaymentsDetails.bankDetails.accountNumber ||
          !parsedPaymentsDetails.bankDetails.ifscCode ||
          !parsedPaymentsDetails.bankDetails.bankName) )
        {
            return res.status(400).json({ message: 'Bank Account details is required for payment' });
      }
      const uploadPromise=images.map(file=>uploadToCloudinary(file as any));
      const uploadImages=await Promise.all(uploadPromise)
      const imageUrl=uploadImages.map(Image=>Image.secure_url)

      const product=new Products({
        title,description,subject,category,condition,classType,price,finalPrice,shippingCharge,paymentMode,
        paymentDetails:parsedPaymentsDetails,
        author,edition,
        seller:sellerId,images:imageUrl
      })
      await product.save();
      return response(res,200,'Product created successfully',product)
    }
catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
