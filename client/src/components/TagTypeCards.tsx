import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useCards } from "../contexts/CardContext";
import { useTags } from "../contexts/TagContext";
import Card from "./common/Card";
import Button from "./common/Button";

const TagTypeCards: React.FC = () => {
  const { type } = useParams<{ type?: string }>();
  const { tags } = useTags();
  const { cards, setCards } = useCards();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedTag = query.get("tag") || "";
  const [showTags, setShowTags] = useState(false);

  // Function to fetch content based on type and tag
  const fetchContent = async (): Promise<void> => {
    try {
      let endpoint = `/api/v1/content/`;
      if (type && selectedTag) {
        endpoint = `/api/v1/content/type/${type}/tag/${selectedTag}`;
      } else if (type) {
        endpoint = `/api/v1/content/type/${type}`;
      } else if (selectedTag) {
        endpoint = `/api/v1/content/tag/${selectedTag}`;
      }

      const res = await axiosInstance.get(endpoint);
      setCards(res.data.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [type, selectedTag]);

 // Function to handle tag selection
  const handleTagSelection = (tagId: string) => {
    const newTag = tagId === selectedTag ? "" : tagId;
    navigate(
      `${type ? `/types/${type}` : "/"}${newTag ? `?tag=${newTag}` : ""}`
    );
  };

  return (
    <div>
      {/* Tag Selection Buttons */}
      <span className="fixed left-55 top-10">
        <Button
          onClick={() => setShowTags((e) => !e)}
          title={showTags ? "Hide Tags" : `Show Tags`}
          variant="primary"
          size="sm"
        />
      </span>
      {showTags && (
        <div className="flex pb-4 justify-center gap-y-2 flex-wrap gap-x-2">
          {tags &&
            tags.map((tag) => (
              <Button
                key={tag._id}
                onClick={() => handleTagSelection(tag._id)}
                variant={selectedTag === tag._id ? "primary" : "secondary"}
                title={tag.title}
                size="sm"
              />
            ))}
        </div>
      )}

      {/* Cards Display */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-2 px-16">
        {cards && cards.length > 0 ? (
          cards.map((card) => <Card key={card._id} data={card} />)
        ) : (
          <p className="text-center text-gray-500">No content available.</p>
        )}
      </div>
    </div>
  );
};

export default TagTypeCards;
