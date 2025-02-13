"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, res) => {
    if (!process.env.SECRET_KEY) {
        throw new Error("Server configuration error: Secret key not provided.");
    }
    const userId = typeof id === "string" ? id : id.toString();
    try {
        const token = jsonwebtoken_1.default.sign({ userId }, process.env.SECRET_KEY, {
            expiresIn: "10d",
        });
        res.cookie("jwt", token, {
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
    }
    catch (err) {
        console.error("Token Generation Error:", err);
        throw new Error("Token generation failed.");
    }
};
exports.default = generateToken;
