import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookiesParser from 'cookie-parser';
import connectDb from './config/dbConnection';
import authRoutes from './routes/authRoutes'
import productRoutes from './routes/productRoute'
import cartRoutes from './routes/cartRoute'
import wishlistRoutes from './routes/wishlistRoutes'
import addressRoutes from './routes/addressRoutes'
import userRoutes from './routes/userRoutes'
import orderRoutes from './routes/orderRoute'

dotenv.config();

const PORT=process.env.PORT||8080;

const app = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credential: true,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookiesParser());

connectDb();
//api endpoints
app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/wishlist',wishlistRoutes);
app.use('/api/user/address',addressRoutes);
app.use('/api/user',userRoutes);
app.use('/api/order',orderRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});