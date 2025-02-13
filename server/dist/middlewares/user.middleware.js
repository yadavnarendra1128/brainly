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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("Server configuration error: Secret key not provided.");
        }
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decoded.userId) {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        req.userId = decoded.userId; // Assign userId to the request
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err); // Error logging
        res.status(401).json({ message: "Invalid or expired token" });
    }
});
exports.default = userMiddleware;
