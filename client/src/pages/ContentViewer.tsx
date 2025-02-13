import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Pencil, Check, X } from "lucide-react"; // Import icons

interface ContentData {
  _id: string;
  title: string;
  type: string;
  content: string;
  link: string;
  createdAt: string;
  userId: string; // Added userId to check ownership
  username: string;
}

const ContentViewer = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedLink, setEditedLink] = useState("");

  const { contentId } = useParams();
  const { user } = useUser(); // Get logged-in user data

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [content]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/v1/content/shared/${contentId}`
        );
        setContent(res.data.data);
        setEditedTitle(res.data.data.title);
        setEditedContent(res.data.data.content);
        setEditedLink(res.data.data.link);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    if (contentId) fetchContent();
  }, [contentId]);

  const handleUpdate = async () => {
    if (!content) return;

    try {
      const updatedData = {
        title: editedTitle,
        content: editedContent,
        link: editedLink,
      };

      await axiosInstance.put(`/api/v1/content/${content._id}`, updatedData);

      setContent({ ...content, ...updatedData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  if (!content) return <p>Loading content...</p>;

  // Check if the logged-in user is the owner
  const isOwner = user?.userId === content.userId;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow-md">
      {/* Title Section */}
      <div className="flex justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Enter title here..."
            className="w-full text-lg font-semibold mb-2 border rounded p-2"
          />
        ) : (
          <h1 className="text-lg font-medium mb-4 text-gray-400">{content?.title ? content.title : "Title"}</h1>
        )}

        {isOwner && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 flex items-center gap-2"
          >
            <Pencil size={18} /> Edit
          </button>
        )}
      </div>

      {/* Editable Link Field */}
      <div className="mb-4">
        {isEditing ? (
          <input
            type="text"
            value={editedLink}
            onChange={(e) => setEditedLink(e.target.value)}
            placeholder="Enter or update link..."
            className="w-full text-blue-600 border rounded p-2"
          />
        ) : (
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 whitespace-pre-wrap underline"
          >
            {content.link}
          </a>
        )}
      </div>

      {/* Content Rendering */}
      {content.type === "video" && (
        <iframe
          className="w-full aspect-video my-4"
          src={content.link.replace("watch?v=", "embed/")}
          title={content.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      )}

      {content.type === "tweet" && content.link && (
        <div className="bg-slate-100 flex justify-center items-center">
          <blockquote className="twitter-tweet">
            <a href={content.link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        </div>
      )}

      {/* Editable Content Field */}
      <div className="mt-4">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Enter content here..."
            className="w-full border rounded p-2"
            rows={4}
          />
        ) : (
          <p className="whitespace-pre-wrap">{content.content}</p>
        )}
      </div>

      {/* Metadata Section */}
      <div className="mt-8">
        <p className="text-gray-500">
          {" "}
          {content?.username || user?.username || ""}
        </p>
        <p className="text-gray-500">
          Added on {content.createdAt.split("T")[0]}
        </p>
      </div>

      {/* Buttons */}
      {isEditing && isOwner && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleUpdate}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            <Check size={18} /> Update
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            <X size={18} /> Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
