"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserController = exports.logOutController = exports.loginController = exports.registerController = void 0;
const auth_validator_1 = require("../validators/auth.validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, username } = req.body;
        const success = auth_validator_1.registerSchema.safeParse(req.body);
        if (!success.success) {
            res.status(400).json({
                err: success.error,
                msg: "Invalid input data in register request",
            });
            return;
        }
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ msg: "Email already exists." });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            username,
        });
        yield newUser.save();
        (0, generateToken_1.default)(newUser._id, res);
        res.status(201).json({
            message: "User registered successfully!",
            data: { username, email, name, userId: newUser._id },
        });
    }
    catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Input Validation
        const validationResult = auth_validator_1.loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                error: validationResult.error,
                msg: "Invalid input data in login request",
            });
            return;
        }
        // Check if User Exists
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ msg: "Invalid email or password" });
            return;
        }
        // Compare Passwords
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ msg: "Invalid email or password" });
            return;
        }
        // Generate Token
        (0, generateToken_1.default)(user._id, res);
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
    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});
exports.loginController = loginController;
const logOutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear the JWT cookie
        res.cookie("jwt", "", {
            maxAge: 0, // Delete the cookie immediately
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.status(200).json({ message: "Logged out successfully!" });
    }
    catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});
exports.logOutController = logOutController;
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            res.status(400).json({ error: "No user ID provided" });
            return;
        }
        const user = yield user_model_1.default.findById(req.userId).select("username email name _id");
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
    }
    catch (err) {
        console.error("Get User Error:", err);
        res.status(500).json({ message: "Server error. Please try again later" });
    }
});
exports.getUserController = getUserController;
