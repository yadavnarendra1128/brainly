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
exports.removeTagController = exports.getTagsController = exports.addTagController = void 0;
const tag_model_1 = __importDefault(require("../models/tag.model"));
const content_model_1 = __importDefault(require("../models/content.model"));
// Add Tag
const addTagController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body; // Expecting tag title from request body
        const userId = req.userId;
        if (!title) {
            res.status(400).json({ error: "Tag title is required." });
            return;
        }
        const createdTag = new tag_model_1.default({ title, userId });
        yield createdTag.save(); // Save the tag to the database
        res
            .status(201)
            .json({ message: "Tag added successfully.", data: createdTag });
    }
    catch (err) {
        console.error("Error while adding tag:", err);
        res.status(500).json({ error: "Server error while adding tag." });
    }
});
exports.addTagController = addTagController;
const getTagsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const Tags = yield tag_model_1.default.find({ userId });
        if (!Tags.length) {
            res.status(404).json({ error: "No tags found for this user." });
            return;
        }
        res.status(201).json({ message: "Got tags successfully.", data: Tags });
    }
    catch (err) {
        console.error("Error while getting tag:", err);
        res.status(500).json({ error: "Server error while getting tag." });
    }
});
exports.getTagsController = getTagsController;
const removeTagController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        if (!id) {
            res.status(400).json({ error: "Tag ID is required." });
            return;
        }
        // Remove the tag from all contents that have it
        const updatedContents = yield content_model_1.default.updateMany({ tags: id }, // Find all contents containing the tag
        { $pull: { tags: id } } // Remove only that tag from the array
        );
        // Delete the tag itself
        const deletedTag = yield tag_model_1.default.findOneAndDelete({ _id: id, userId });
        if (!deletedTag) {
            res.status(404).json({ error: "Tag not found or unauthorized." });
            return;
        }
        res.status(200).json({
            message: "Tag removed from all associated contents and deleted successfully.",
        });
    }
    catch (error) {
        console.error("Error removing tag from contents:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.removeTagController = removeTagController;
