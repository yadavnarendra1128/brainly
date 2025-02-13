import React, { useEffect, useRef, useState } from "react";
import Trash from "../../utils/icons/Trash";
import DocumentLogo from "../../utils/icons/DocumentLogo";
import LinkLogo from "../../utils/icons/LinkLogo";
import YoutubeLogo from "../../utils/icons/YoutubeLogo";
import TwitterLogo from "../../utils/icons/TwitterLogo";
import { ShareIcon } from "../../utils/icons/ShareIcon";
import DotIcon from "../../utils/icons/DotIcon";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useCards } from "../../contexts/CardContext";
import { useModal } from "../../contexts/ModalContext";
import { useUser } from "../../contexts/UserContext";
import { useTagBox } from "../../contexts/TagBoxContext";
import { useTags } from "../../contexts/TagContext";
import Button from "./Button";

export interface TagTypes {
  _id: string;
  title: string;
  userId: string;
}

interface Data {
  data: {
    _id: string;
    content: string;
    title: string;
    type: string;
    link: string;
    userId: string;
    tags: TagTypes[];
    createdAt: string;
  };
}

const IconType: Record<string, React.ReactNode> = {
  document: <DocumentLogo size="sm" />,
  link: <LinkLogo size="sm" />,
  video: <YoutubeLogo size="sm" />,
  tweet: <TwitterLogo size="sm" />,
};

const Card:React.FC<Data> = ({ data }) => {
  const { user } = useUser();
  const { tags, setTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<TagTypes[]>([]);
  const { tagBox, setTagBox, handleTagBox } = useTagBox();
  const [tagInput, setTagInput] = useState("");

  const { setCards } = useCards();
  const { setModal } = useModal();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/api/v1/content/${data._id}`);
      setCards((cards) => {
        return cards && cards.filter((card) => card._id !== data._id);
      });
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

    const handleTagDelete = async (id: string) => {
      try {
        const res = await axiosInstance.delete(`/api/v1/tag/${id}`);
        setTags((prevTags) => {
          return prevTags.filter((tag) => tag._id != id);
        });
        setCards((prevCards) =>
          prevCards.map((card) => ({
            ...card,
            tags: card.tags.filter((tag) => tag._id != id),
          }))
        );
      } catch (error) {
        console.error("Error deleting content:", error);
      }
    };

  const copyToClipboard = async (shareLink: string) => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleShare = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/content/share/content/${data._id}`
      );
      const link =
        (import.meta.env.VITE_ENV == "production"
          ? import.meta.env.VITE_BACKEND_TARGET_URL
          : "http://localhost:5173") +
        "/shared/" +
        res.data.data;
      copyToClipboard(link);
      setModal("share-content");
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  const handleContentClick = () => {
    setTagBox("");
    !tagBox && navigate(`/content/${data._id}`);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tag: TagTypes
  ) => {
    const isChecked = e.target.checked;

    setSelectedTags(
      (prevSelected) =>
        isChecked
          ? [...prevSelected, tag] // Add tag if checked
          : prevSelected.filter((t) => t._id !== tag._id) // Remove tag if unchecked
    );
  };

  const handleTagSubmission = async () => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/content/tags/${data._id}`,
        {
          tags: selectedTags.map((tag) => tag._id),
        }
      );

      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === data._id
            ? {
                ...card,
                tags: response.data.data,
              }
            : card
        )
      );
      setTagBox("");
    } catch (error) {
      console.error("Error adding tags to content:", error);
    }
  };

  const handleCreateTag = async () => {
    if (tagInput.trim() === "") return; // Prevent empty tags
    try {
      const response = await axiosInstance.post("/api/v1/tag", {
        title: tagInput,
      });

      setTags((prev) => [...prev, response.data.data]);
      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === data._id
            ? { ...card, tags: [...(card.tags || []), response.data.data] }
            : card
        )
      );

      setTagInput(""); 
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  useEffect(() => {
    setSelectedTags([...data.tags]);
  }, [tags]);

  return (
    <div className="relative overflow-hidden bg-white rounded-xl py-2 pt-4 px-4 shadow-md border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out w-full min-h-80 h-fit">
      <div className="flex items-center pb-2 border-b border-gray-200">
        <span className="pt-0.5">
          {IconType[data.type] || IconType.document}
        </span>
        <h3 className="text-base font-semibold text-gray-800 ml-2 truncate">
          {data?.title ? data.title : "Title"}
        </h3>
        <span className="absolute right-2">
          <DotIcon
            onClick={(e) => (e.stopPropagation(), handleTagBox(data._id))}
          />
        </span>

        {tagBox === data._id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute overflow-scroll scrollbar-none h-fit max-h-60 right-1 top-6 outline-none bg-white border border-gray-300 shadow-lg rounded-md p-2 w-62 z-50"
          >
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Search tags"
              className="w-full text-gray-500 text-sm p-1 border border-gray-400 rounded"
            />
            <div className="flex justify-between items-center my-2">
              <div
                onClick={handleCreateTag}
                className="text-sm text-blue-600 cursor-pointer hover:underline"
              >
                + Create {tagInput ? `"${tagInput}"` : null}
              </div>
              <Button
                onClick={handleTagSubmission}
                variant="primary"
                title="Submit"
                size="sm"
              />
            </div>
            <div className="flex flex-col gap-y-1 pb-2">
              {tags.length > 0 && !tagInput
                ? tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="text-sm text-gray-700 hover:text-blue-500 cursor-pointer flex items-center"
                    >
                      <input
                        className="mt-0.5"
                        type="checkbox"
                        checked={selectedTags.some(
                          (selectedTag) => selectedTag._id === tag._id
                        )}
                        onChange={(e) => handleCheckboxChange(e, tag)}
                      />
                      <div className="ml-2 w-full items-center pr-2 flex justify-between">
                        <div className="pl-2">{tag.title}</div>
                        <Trash
                          onClick={(e) => (
                            e.stopPropagation(), handleTagDelete(tag._id)
                          )}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))
                : tags.map(
                    (tag) =>
                      tag.title
                        .toLowerCase()
                        .includes(tagInput.toLowerCase()) && (
                        <div
                          key={tag._id}
                          className="text-sm text-gray-700 hover:text-blue-500 cursor-pointer flex items-center"
                        >
                          <input
                            className="mt-0.5"
                            type="checkbox"
                            checked={selectedTags.some(
                              (selectedTag) => selectedTag._id === tag._id
                            )}
                            onChange={(e) => handleCheckboxChange(e, tag)}
                          />
                          <div className="ml-2 w-full items-center pr-2 flex justify-between">
                            <div className="pl-2">{tag.title}</div>
                            <Trash
                              onClick={(e) => (
                                e.stopPropagation(), handleTagDelete(tag._id)
                              )}
                              size="sm"
                            />
                          </div>
                        </div>
                      )
                  )}
            </div>
          </div>
        )}
      </div>

      {
        <div className="h-70 overflow-hidden">
          {data.type == "video" && data.link && (
            <>
              <div className="mt-3 px-1">
                <iframe
                  className="w-full aspect-video"
                  src={data.link.replace("watch?v=", "embed/")}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-gray-700 text-sm sm:text-base line-clamp-4 absolute bottom-3 left-6 z-5">
                <Link
                  to={data.link}
                  className="text-blue-500 text-base underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Link
                </Link>
              </p>
            </>
          )}

          {data.type == "tweet" && data.link && (
            <>
              <div className="mt-3 px-1">
                <blockquote className="twitter-tweet">
                  <a href={`${data.link.replace("x.com", "twitter.com")}`}></a>
                </blockquote>
              </div>
              <p className="text-gray-700 text-sm sm:text-base absolute bottom-3 z-5 left-6">
                <Link
                  onClick={(e) => e.stopPropagation()}
                  to={data.link}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </Link>
              </p>
            </>
          )}
          {data.type === "document" && (
            <>
              <div className="mt-3 px-1 whitespace-pre-wrap">
                {data.content}
              </div>
              {data.link && (
                <p className="text-gray-700 text-sm sm:text-base absolute bottom-3 z-5 left-6">
                  <Link
                    onClick={(e) => e.stopPropagation()}
                    to={data.link}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </Link>
                </p>
              )}
            </>
          )}

          {data.type == "link" && (
            <>
              <div className="mt-3 px-1 whitespace-pre-wrap">
                {data.content}
              </div>
              <p className="text-gray-700 bottom-3 z-6 left-6 absolute whitespace-pre-wrap text-sm sm:text-base mt-2 px-1 break-words">
                <Link
                  to={data.link}
                  className="text-blue-500 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Link
                </Link>
              </p>
            </>
          )}
        </div>
      }

      <div
        onClick={handleContentClick}
        className="h-25 pb-1 bg-slate-100 absolute bottom-2 left-4 right-4"
      >
        {/* {selectedTags.length>0 && */}
        {
          <div className="px-1 flex gap-x-2 max-h-20 h-17 pb-4 pt-1 gap-y-2 flex-wrap overflow-hidden">
            {selectedTags.map((tag) => (
              <div
                key={tag._id}
                className="px-2 py-1 w-fit h-fit flex justify-center items-center text-xs rounded-lg bg-purple-300 text-purple-600 hover:text-black"
              >
                {tag.title}
              </div>
            ))}
          </div>
        }

        <div className="flex items-center h-5 text-slate-500 justify-end gap-x-4">
          <span className="text-base pt-4">
            Added on {data.createdAt.split("T")[0]}
          </span>
          <div className="flex gap-1 pt-4">
            <span className="pt-1">
              <ShareIcon
                onClick={(e) => (e.stopPropagation(), handleShare())}
                size="md"
                color="card"
              />
            </span>
            <Trash
              onClick={(e) => (e.stopPropagation(), handleDelete())}
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
