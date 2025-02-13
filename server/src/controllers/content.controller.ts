import { Request, Response } from "express";
import Content from "../models/content.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import Tag from "../models/tag.model";

export interface customRequest extends Request {
  body: any;
  params: any;
  userId?: string;
}

// Create Content
export const createContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { link, type, title, content, tags } = req.body;
    const userId = req.userId;

    if (!link && !content && !tags) {
      res.status(400).json({ error: "At least one field is required." });
      return;
    }

    const newContent = new Content({
      link,
      type,
      title,
      content,
      userId,
      tags,
    });
    await newContent.save();

    const addedContent = await Content.findById(newContent._id).populate({
      path: "tags",
      select: "title _id userId",
    });
    res
      .status(201)
      .json({ message: "Content created successfully", data: addedContent });
  } catch (err) {
    res.status(500).json({ error: "Server error while creating content" });
  }
};

// update content
export const updateContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const content = await Content.find({ _id: id, userId });
    if (!content) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }
    const updatedContent = await Content.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate({
      path: "tags",
      select: "title _id userId",
    });
    res
      .status(200)
      .json({ data: updatedContent, msg: "content updated successfuly" });
  } catch {}
};

// update tags
export const updateTagsController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Content ID
    const { tags } = req.body; // Array of tag IDs
    const userId = req.userId; // Authenticated user ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ error: "Invalid content ID" });return;
    }

    if (Array.isArray(tags) && tags.length === 0) {
      const content = await Content.findByIdAndUpdate(
        id,
        { tags: [] },
        { new: true } // Ensure updated content is returned
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
    const validTagIds = tags.filter(tag => mongoose.Types.ObjectId.isValid(tag));
    const invalidTagIds = tags.filter(tag => !mongoose.Types.ObjectId.isValid(tag));

    if (invalidTagIds.length > 0) {
       res.status(400).json({
        error: "Some tag IDs are invalid",
        invalidTags: invalidTagIds,
      });return;
    }

    // ✅ Convert valid tag strings to ObjectId
    const tagObjectIds = validTagIds.map(tag => new mongoose.Types.ObjectId(tag));

    // ✅ Check if content exists and belongs to the user
    const content = await Content.findOne({ _id: id, userId });
    if (!content) {
       res.status(404).json({ error: "Content not found or unauthorized" });return;
    }

    // ✅ Query existing tags in DB
    const tagDocs = await Tag.find({ _id: { $in: tagObjectIds }, userId });

    // 🛑 Check if some tags were not found
    if (tagDocs.length !== validTagIds.length) {
      const missingTags = validTagIds.filter(
        id => !tagDocs.some(tag => tag._id.equals(id))
      );

       res.status(400).json({
        error: "Some tag IDs were not found in the database",
        missingTags,
      });return;
    }

    // ✅ Update content with found tags
    const updatedContent = await Content.findOneAndUpdate(
      { _id: id, userId },
      { $set: { tags: tagDocs.map(tag => tag._id) } }, // Store only tag ObjectIds
      { new: true }
    ).populate({
      path: "tags",
      select: "title _id userId",
    });

    res.status(200).json({ data: updatedContent, msg: "Content updated successfully" });
  } catch (err) {
    console.error("Error while updating tags:", err);
    res.status(500).json({ error: "Server error while updating tags." });
  }
};

// Delete Content
export const deleteContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deletedContent = await Content.findOneAndDelete({ _id: id, userId });
    if (!deletedContent) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting content" });
  }
};

// Get Content
export const getAllContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const contents = await Content.find({ userId }).populate({
      path: "tags",
      select: "title _id userId",
    });

    res.status(200).json({ data: contents });
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching content" });
  }
};

// Get Type Content
export const getTypeContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { type } = req.params;
    const contents = await Content.find({ userId, type }).populate({
      path: "tags",
      select: "_id title userId",
    });
    res.status(200).json({ data: contents });
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching content" });
  }
};

// Get Tag Content
export const getTagContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { tag } = req.params; // This should be the tag ID

    // Find content where 'tags' array contains the specified tag ID
    const contents = await Content.find({
      userId,
      tags: tag, // Check if 'tags' array contains this tag ID
    }).populate({
      path: "tags",
      select: "title _id userId",
    });

    res.status(200).json({ data: contents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching content" });
  }
};

// get content based on link
export const getContentByIdController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const content = await Content.findOne({ _id: id }).populate({
      path: "tags",
      select: "title _id userId",
    });
    if (!content) {
      res.status(404).json({ error: "Content not found" });
      return;
    }
    res.status(200).json({ data: content });
  } catch {}
};

const createLink = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let link = "";
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    link += chars[randomIndex];
  }
  return link;
};

// share link of content
export const shareContentController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const content = await Content.findOne({ _id: id });

    if (!content) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }
    const link = "content/" + createLink() + "/" + content._id;
    res.status(200).json({ data: link });
  } catch (err) {
    res.status(500).json({ msg: "link creation error in shareContent" });
  }
};

// share link of brain
export const shareBrainController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const content = await Content.find({ userId });
    if (content.length == 0) {
      res.status(404).json({ error: "Content not found or unauthorized" });
      return;
    }
    const link: string = "brain/" + createLink() + "/" + userId;
    res.status(200).json({ data: link });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error in shareBrain" });
  }
};

// show content of user based on link of User Brain
export const getBrainController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id: userId } = req.params;
    const content = await Content.find({ userId }).populate({
      path: "tags",
      select: "title _id userId",
    });
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (!content) {
      res.status(404).json({ error: "Content not found under this user" });
      return;
    }

    res.status(200).json({ content, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error in getBrain" });
  }
};

export const getTagType = async (req:customRequest, res:Response) => {
  try {
    const { type, tag } = req.params;
    const userId=req.userId
    const content = await Content.find({ userId,type, tags: tag });
    res.json({ data: content });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch content" });
  }
};
