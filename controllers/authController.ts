import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import { sendVerificationToEmail } from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, "User already exists");
    }

    const varificationToken = crypto.randomBytes(20).toString("hex");
    console.log(varificationToken);
    const user = new User({
      name,
      email,
      password,
      agreeTerms,
      varificationToken,
    });

    await user.save();
const result=await sendVerificationToEmail(user.email,varificationToken)
    return response(
      res,
      200,
      "User registration successful, Please check your email box to verify your account"
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token=req.params;
    const user=await User.findOne({varificationToken:token});
    if(!user){
        return response(res,400,'Invaild or expired verification token')
    }
    user.isVerified=true;
    user.verificationToken=undefined;
    const accessToken=generateToken(user);
    res.cookie('access_token',accessToken,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })
    await user.save();
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user || !(await user.comparePassword(password))){
        return response(res,400,'Invaild email or password')
    }

    if(!user.isVerified){
        return response(res,400,'Please verify your email before login .Check your inbox')
    }
    const accessToken=generateToken(user);
    res.cookie('access_token',accessToken,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })
    
    return response(res,200,'user login successfully',{user: {name:user.name,email:user.email}});
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};