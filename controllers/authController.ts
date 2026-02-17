import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import { sendResetPasswordLinkToEmail, sendVerificationToEmail } from "../config/emailConfig";
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
    const result = await sendVerificationToEmail(user.email, varificationToken)
    return response(
      res,
      200,
      "User registration successful, Please check your email box to verify your account",result
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const {token} = req.params;
    const user = await User.findOne({ varificationToken: token });
    if (!user) {
      return response(res, 400, 'Invaild or expired verification token')
    }
    user.isVerified = true;
    user.varificationToken = undefined;
    const accessToken = generateToken(user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
  sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    })
    await user.save();
    return response(res, 200, 'Your email have verified successfully');
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return response(res, 400, 'Invaild email or password')
    }

    if (!user.isVerified) {
      return response(res, 400, 'Please verify your email before login .Check your inbox')
    }
    const accessToken = generateToken(user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
  sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    })

    return response(res, 200, 'user login successfully', { user: { name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response(res, 400, 'No account found with this email address')
    }
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 360000);
    await user.save();
    await sendResetPasswordLinkToEmail(user.email, resetPasswordToken);
    return response(res, 200, 'Password reset link has been sent to your email address');
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const {token} = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return response(res, 400, 'Invaild or expired reset password token')
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return response(res, 200, 'Your password reset successfully');
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
  sameSite: "none",
    })
    return response(res, 200, 'You logged out successfully');
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};
export const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    if (!userId) {
      return response(
        res,
        400,
        "Unauthenticated, please login to access our data"
      );
    }

    const user = await User.findById(userId).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return response(res, 403, "User not found");
    }

    return response(res, 201, "User retrieved successfully", user);
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};