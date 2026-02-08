import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import CartItems from "../models/CartItems";
import Order from "../models/Order";


export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    const body = req.body?.updates ?? req.body;
    const {
      orderId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentDetails,
    } = body || {};

    console.log('BODY:', body);

    let order = null;
    let cart = null;

    if (orderId) {
      order = await Order.findById(orderId);
      if (!order) return response(res, 404, 'Order not found');

      if (shippingAddress) order.shippingAddress = shippingAddress;
      if (paymentMethod) order.paymentMethod = paymentMethod;
      if (totalAmount) order.totalAmount = totalAmount;

      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
        order.paymentStatus = 'complete';
        order.status = 'processing';
      }
    } else {
      cart = await CartItems.findOne({ user: userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return response(res, 400, 'Cart is empty');
      }

      order = new Order({
        user: userId,
        items: cart.items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
      });
    }

    await order.save();

    if (paymentDetails) {
      await CartItems.findOneAndUpdate(
        { user: userId },
        { $set: { items: [] } }
      );
    }

    return response(res, 200, 'Order updated successfully', order);
  } catch (error) {
    console.error(error);
    return response(res, 500, 'Server error', error);
  }
};


export const getOrderByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const order = await Order.find({ user: userId }).sort({ createdAt: -1 })
            .populate('user', 'name email').populate('shippingAddress')
            .populate({
                path: 'items.product',
                model: 'Product'
            })

        if (!order) {
            return response(res, 404, 'Order not found ')
        }

        return response(res, 200, 'user oder fetched Successfully', order)

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again");
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email').populate('shippingAddress')
            .populate({
                path: 'items.product',
                model: 'Product'
            })
        if (!order) {
            return response(res, 404, 'Order not found ')
        }

        return response(res, 200, 'oder fetched by Id Successfully', order)
    }
    catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error, please try again");
    }
}