import { Request, Response } from "express";
import Tag from "../models/tag.model";
import Content from "../models/content.model";

export interface customRequest extends Request {
  body: any;
  params: any;
  userId?: string;
}
// Add Tag
export const addTagController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { title } = req.body; // Expecting tag title from request body
    const userId = req.userId;

    if (!title) {
      res.status(400).json({ error: "Tag title is required." });
      return;
    }

    const createdTag = new Tag({ title, userId });
    await createdTag.save(); // Save the tag to the database
    res
      .status(201)
      .json({ message: "Tag added successfully.", data: createdTag });
  } catch (err) {
    console.error("Error while adding tag:", err);
    res.status(500).json({ error: "Server error while adding tag." });
  }
};

export const getTagsController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const Tags = await Tag.find({userId})

    if (!Tags.length) {
      res.status(404).json({ error: "No tags found for this user." });
      return;
    }
    res.status(201).json({ message: "Got tags successfully.", data: Tags });
  } catch (err) {
    console.error("Error while getting tag:", err);
    res.status(500).json({ error: "Server error while getting tag." });
  }
};


export const removeTagController = async (
  req: customRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
      res.status(400).json({ error: "Tag ID is required." });
      return;
    }

    // Remove the tag from all contents that have it
    const updatedContents = await Content.updateMany(
      { tags: id }, // Find all contents containing the tag
      { $pull: { tags: id } } // Remove only that tag from the array
    );

    // Delete the tag itself
    const deletedTag = await Tag.findOneAndDelete({ _id: id, userId });

    if (!deletedTag) {
      res.status(404).json({ error: "Tag not found or unauthorized." });
      return;
    }

    res.status(200).json({
      message:
        "Tag removed from all associated contents and deleted successfully.",
    });
  } catch (error) {
    console.error("Error removing tag from contents:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
