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
exports.getTagType = exports.getBrainController = exports.shareBrainController = exports.shareContentController = exports.getContentByIdController = exports.getTagContentController = exports.getTypeContentController = exports.getAllContentController = exports.deleteContentController = exports.updateTagsController = exports.updateContentController = exports.createContentController = void 0;
const content_model_1 = __importDefault(require("../models/content.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
// Create Content
const createContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title, content, tags } = req.body;
        const userId = req.userId;
        if (!link && !content && !tags) {
            res.status(400).json({ error: "At least one field is required." });
            return;
        }
        const newContent = new content_model_1.default({
            link,
            type,
            title,
            content,
            userId,
            tags,
        });
        yield newContent.save();
        const addedContent = yield content_model_1.default.findById(newContent._id).populate({
            path: "tags",
            select: "title _id userId",
        });
        res
            .status(201)
            .json({ message: "Content created successfully", data: addedContent });
    }
    catch (err) {
        res.status(500).json({ error: "Server error while creating content" });
    }
});
exports.createContentController = createContentController;
// update content
const updateContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const content = yield content_model_1.default.find({ _id: id, userId });
        if (!content) {
            res.status(404).json({ error: "Content not found or unauthorized" });
            return;
        }
        const updatedContent = yield content_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).populate({
            path: "tags",
            select: "title _id userId",
        });
        res
            .status(200)
            .json({ data: updatedContent, msg: "content updated successfuly" });
    }
    catch (_a) { }
});
exports.updateContentController = updateContentController;
// update tags
const updateTagsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Content ID
        const { tags } = req.body; // Array of tag IDs
        const userId = req.userId; // Authenticated user ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: "Invalid content ID" });
            return;
        }
        if (Array.isArray(tags) && tags.length === 0) {
            const content = yield content_model_1.default.findByIdAndUpdate(id, { tags: [] }, { new: true } // Ensure updated content is returned
            );
            res
                .status(200)
                .json({ data: content, msg: "Tags removed successfully." });
            return;
        }
        if (!tags || !Array.isArray(tags)) {
            res.status(400).json({ error: "Tags must be a non-empty array." });
            return;
        }
        // ✅ Filter out valid ObjectIds
        const validTagIds = tags.filter(tag => mongoose_1.default.Types.ObjectId.isValid(tag));
        const invalidTagIds = tags.filter(tag => !mongoose_1.default.Types.ObjectId.isValid(tag));
        if (invalidTagIds.length > 0) {
            res.status(400).json({
                error: "Some tag IDs are invalid",
                invalidTags: invalidTagIds,
            });
            return;
        }
        // ✅ Convert valid tag strings to ObjectId
        const tagObjectIds = validTagIds.map(tag => new mongoose_1.default.Types.ObjectId(tag));
        // ✅ Check if content exists and belongs to the user
        const content = yield content_model_1.default.findOne({ _id: id, userId });
        if (!content) {
            res.status(404).json({ error: "Content not found or unauthorized" });
            return;
        }
        // ✅ Query existing tags in DB
        const tagDocs = yield tag_model_1.default.find({ _id: { $in: tagObjectIds }, userId });
        // 🛑 Check if some tags were not found
        if (tagDocs.length !== validTagIds.length) {
            const missingTags = validTagIds.filter(id => !tagDocs.some(tag => tag._id.equals(id)));
            res.status(400).json({
                error: "Some tag IDs were not found in the database",
                missingTags,
            });
            return;
        }
        // ✅ Update content with found tags
        const updatedContent = yield content_model_1.default.findOneAndUpdate({ _id: id, userId }, { $set: { tags: tagDocs.map(tag => tag._id) } }, // Store only tag ObjectIds
        { new: true }).populate({
            path: "tags",
            select: "title _id userId",
        });
        res.status(200).json({ data: updatedContent, msg: "Content updated successfully" });
    }
    catch (err) {
        console.error("Error while updating tags:", err);
        res.status(500).json({ error: "Server error while updating tags." });
    }
});
exports.updateTagsController = updateTagsController;
// Delete Content
const deleteContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const deletedContent = yield content_model_1.default.findOneAndDelete({ _id: id, userId });
        if (!deletedContent) {
            res.status(404).json({ error: "Content not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Content deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Server error while deleting content" });
    }
});
exports.deleteContentController = deleteContentController;
// Get Content
const getAllContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const contents = yield content_model_1.default.find({ userId }).populate({
            path: "tags",
            select: "title _id userId",
        });
        res.status(200).json({ data: contents });
    }
    catch (err) {
        res.status(500).json({ error: "Server error while fetching content" });
    }
});
exports.getAllContentController = getAllContentController;
// Get Type Content
const getTypeContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { type } = req.params;
        const contents = yield content_model_1.default.find({ userId, type }).populate({
            path: "tags",
            select: "_id title userId",
        });
        res.status(200).json({ data: contents });
    }
    catch (err) {
        res.status(500).json({ error: "Server error while fetching content" });
    }
});
exports.getTypeContentController = getTypeContentController;
// Get Tag Content
const getTagContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { tag } = req.params; // This should be the tag ID
        // Find content where 'tags' array contains the specified tag ID
        const contents = yield content_model_1.default.find({
            userId,
            tags: tag, // Check if 'tags' array contains this tag ID
        }).populate({
            path: "tags",
            select: "title _id userId",
        });
        res.status(200).json({ data: contents });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching content" });
    }
});
exports.getTagContentController = getTagContentController;
// get content based on link
const getContentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const content = yield content_model_1.default.findOne({ _id: id }).populate({
            path: "tags",
            select: "title _id userId",
        });
        if (!content) {
            res.status(404).json({ error: "Content not found" });
            return;
        }
        res.status(200).json({ data: content });
    }
    catch (_a) { }
});
exports.getContentByIdController = getContentByIdController;
const createLink = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let link = "";
    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        link += chars[randomIndex];
    }
    return link;
};
// share link of content
const shareContentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const content = yield content_model_1.default.findOne({ _id: id });
        if (!content) {
            res.status(404).json({ error: "Content not found or unauthorized" });
            return;
        }
        const link = "content/" + createLink() + "/" + content._id;
        res.status(200).json({ data: link });
    }
    catch (err) {
        res.status(500).json({ msg: "link creation error in shareContent" });
    }
});
exports.shareContentController = shareContentController;
// share link of brain
const shareBrainController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const content = yield content_model_1.default.find({ userId });
        if (content.length == 0) {
            res.status(404).json({ error: "Content not found or unauthorized" });
            return;
        }
        const link = "brain/" + createLink() + "/" + userId;
        res.status(200).json({ data: link });
    }
    catch (err) {
        res.status(500).json({ msg: "Internal server error in shareBrain" });
    }
});
exports.shareBrainController = shareBrainController;
// show content of user based on link of User Brain
const getBrainController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.params;
        const content = yield content_model_1.default.find({ userId }).populate({
            path: "tags",
            select: "title _id userId",
        });
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (!content) {
            res.status(404).json({ error: "Content not found under this user" });
            return;
        }
        res.status(200).json({ content, username: user.username });
    }
    catch (err) {
        res.status(500).json({ msg: "Internal server error in getBrain" });
    }
});
exports.getBrainController = getBrainController;
const getTagType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, tag } = req.params;
        const userId = req.userId;
        const content = yield content_model_1.default.find({ userId, type, tags: tag });
        res.json({ data: content });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});
exports.getTagType = getTagType;
