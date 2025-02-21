import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 4000;
connectDB();
const allowedOrigins = ["http://localhost:5173"];
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.get("/", (req, res) => res.send("API working"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(port, () => console.log(`Server started on PORT:${port}`));
