import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

const generateToken = (
  id: Types.ObjectId | string,
  res: Response
): void => {
  if (!process.env.SECRET_KEY) {
    throw new Error("Server configuration error: Secret key not provided.");
  }

  const userId = typeof id === "string" ? id : id.toString();

  try {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    
  } catch (err) {
    console.error("Token Generation Error:", err);
    throw new Error("Token generation failed.");
  }
};

export default generateToken;
