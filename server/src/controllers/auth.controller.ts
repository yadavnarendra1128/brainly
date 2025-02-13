import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
export interface customRequest extends Request {
  body: any;
  params: any;
  userId?: string;
}
export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, username } = req.body;

    const success = registerSchema.safeParse(req.body);
    if (!success.success) {
      res.status(400).json({
        err: success.error,
        msg: "Invalid input data in register request",
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ msg: "Email already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully!",
      data: { username, email, name, userId: newUser._id },
    });
  } catch (err: unknown) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Input Validation
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: validationResult.error,
        msg: "Invalid input data in login request",
      });
      return;
    }

    // Check if User Exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ msg: "Invalid email or password" });
      return;
    }

    // Compare Passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ msg: "Invalid email or password" });
      return;
    }

    // Generate Token
    generateToken(user._id, res);

    // Successful Login Response
    res.status(200).json({
      message: "Login successful!",
      data: {
        username: user.username,
        email: user.email,
        name: user.name,
        userId: user._id,
      },
    });
  } catch (err: unknown) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const logOutController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", {
      maxAge: 0, // Delete the cookie immediately
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getUserController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(400).json({ error: "No user ID provided" });
      return;
    }

    const user = await User.findById(req.userId).select(
      "username email name _id"
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      data: {
        username: user.username,
        email: user.email,
        name: user.name,
        userId: user._id,
      },
    });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Server error. Please try again later" });
  }
};
