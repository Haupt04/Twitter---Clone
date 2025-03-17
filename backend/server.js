import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
import {v2 as cloudinary} from 'cloudinary'

import connectMongoDB from './db/connectMongoDB.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import notificationRoutes from './routes/notifications.route.js';
import cors from "cors";
import path from "path"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

// app.use(cors({
//     origin: "http://localhost:3000",  // ✅ Allow frontend
//     credentials: true
//   }));
  

app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoutes);


if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "frontend/dist")))

    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectMongoDB()
})