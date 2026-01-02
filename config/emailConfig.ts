import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(
      "gmail service is not ready to send the email,please check the email configuration"
    );
  } else {
    console.log("gmail service is ready to send the email");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: `"Your BookChain" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  });
};

export const sendVerificationToEmail = async (
  to: string,
  token: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const html = `
    <h1>Welcome to your BookChain!Verify your email</h1>
    <p>Thankyou for registering. Please click link below to verify your email address:</p>
    <a href="${verificationUrl}">Verify your Email</a>
    <p>If you didn't request this or verified your account,please ignore this email</p>
  `;
  await sendEmail(to,'Please verify your email to access your BookChain',html);
};

export const sendResetPasswordLinkToEmail = async (
  to: string,
  token: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const html = `
    <h1>Welcome to your BookChain!Please Reset your Password</h1>
    <p>You have requested to reset your password ,click the link below to set the new password</p>
    <a href="${resetUrl}">Reset your password</a>
    <p>If you didn't request this or verified your account,please ignore this email and your password will be remain unchanged.</p>
  `;
  await sendEmail(to,'Please reset your password',html);
};