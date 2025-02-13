import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
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
      type: mongoose.Types.ObjectId,
      ref: "Tag",
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", contentSchema);
export default Content;
