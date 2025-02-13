"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    content: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Content",
        }
    ],
    tags: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tag' }]
});
const User = mongoose_1.default.model('User', userModel);
exports.default = User;
