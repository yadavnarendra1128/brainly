"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contentSchema = new mongoose_1.default.Schema({
    link: {
        type: String,
        trim: true, // Removes extra spaces
    },
    type: {
        type: String,
    },
    title: {
        type: String,
        trim: true,
        maxlength: 250,
    },
    content: {
        type: String,
    },
    tags: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Tag",
        },
    ],
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Content = mongoose_1.default.model("Content", contentSchema);
exports.default = Content;
