import React from "react";
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

interface Data {
  _id: string;
  content: string;
  title: string;
  type: string;
  link: string;
  userId: string;
  tags: { _id: string;title:string;userId:string }[];
  createdAt: string;
}

interface CardTypes {
  data: Data;
}

const IconType: Record<string, React.ReactNode> = {
  document: <DocumentLogo size="sm" />,
  link: <LinkLogo size="sm" />,
  video: <YoutubeLogo size="sm" />,
  tweet: <TwitterLogo size="sm" />,
};

const PublicCard: React.FC<CardTypes> = ({ data }) => {
  const { setModal } = useModal();
  const navigate = useNavigate();

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

  const handleTags = () => {
    // TODO: Implement tag functionality
  };

  const handleContentClick = () => {
    navigate(`/shared/view/${data._id}`);
  };

  return (
    <div className="relative bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out w-full h-auto min-h-80">
      <div
        onClick={handleContentClick}
        className="flex items-center pb-2 border-b border-gray-200 max-h-60 overflow-hidden "
      >
        <span className="pt-0.5">
          {IconType[data.type] || IconType.document}
        </span>
        <h3 className="text-base font-semibold text-gray-800 ml-2 truncate">
          {data?.title ? data.title : "Title"}
        </h3>
        <span className="absolute right-2 top-4">
          {/* <DotIcon onClick={(e) => (e.stopPropagation(), handleTags())} /> */}
        </span>
      </div>
      <div
        onClick={handleContentClick}
        className="overflow-hidden max-h-60 mb-5"
      >
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
            <p className="text-gray-700 text-sm sm:text-base line-clamp-4 absolute bottom-12 left-4 z-5">
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
            <p className="text-gray-700 text-sm sm:text-base absolute bottom-12 z-5 left-4">
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
            <div className="mt-3 px-1 whitespace-pre-wrap">{data.content}</div>
            {data.link && (
              <p className="text-gray-700 text-sm sm:text-base absolute bottom-12 z-5 left-4">
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

        {data.type == "link" && data.link && (
          <>
            <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base mt-2 px-1 break-words">
              <Link
                to={data.link}
                className="text-blue-500 underline break-all"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {data.link}
              </Link>
            </p>
          </>
        )}
      </div>

      <div
        onClick={handleContentClick}
        className="flex justify-between items-center h-15 pt-5 text-gray-500 bg-white absolute bottom-4 left-4 right-4"
      >
        <span className="text-base">
          Added on {data.createdAt.split("T")[0]}
        </span>
        <div className="flex gap-2">
          {/* <span className="pt-1">
            <ShareIcon
              onClick={(e) => (e.stopPropagation(), handleShare())}
              size="md"
              color="card"
            />
          </span> */}
          {/* <Trash
            onClick={(e) => (e.stopPropagation(), handleDelete())}
            size="md"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default PublicCard;
