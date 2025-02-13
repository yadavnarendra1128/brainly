import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db";
const PORT = process.env.PORT || 8080;

import express from "express";
const app = express();
import cors from "cors";

import AuthRouter from "./routes/auth.route";
import ContentRouter from "./routes/content.route";
import TagRouter from "./routes/tag.route";
import  cookieParser  from 'cookie-parser';

const corsOptions = {origin:process.env.FRONTEND_URL,credentials:true}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/content", ContentRouter);
app.use('/api/v1/tag',TagRouter);

app.get("/api/v1/", (req, res) => {
  res.json({ message: "API is running!" });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB(); // Ensure DB connection before starting the server

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
};

startServer();
