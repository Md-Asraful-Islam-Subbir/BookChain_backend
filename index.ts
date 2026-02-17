import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/dbConnection.js";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoute";
import cartRoutes from "./routes/cartRoute";
import wishlistRoutes from "./routes/wishlistRoutes";
import addressRoutes from "./routes/addressRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoute";
import passport from "./controllers/strategy/googleStrategy";
import paymentRoutes from "./routes/payment";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.set("trust proxy", 1); // ✅ REQUIRED on Render

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

connectDb();

app.get("/", (req, res) => {
  res.send("✅ BookChain Backend API is running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user/address", addressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
