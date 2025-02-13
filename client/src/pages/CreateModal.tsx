import React, { ReactNode, useRef, useState } from "react";
import CrossIcon from "../utils/icons/CrossIcon";
import InputType from "../components/common/InputType";
import Button from "../components/common/Button";
import axiosInstance from "./../utils/axiosInstance";
import InputTextArea from "../components/common/InputTextArea";
import { useCards } from "../contexts/CardContext";
import { useModal } from "../contexts/ModalContext";
import { useTags } from "../contexts/TagContext";
import { useTagBox } from "../contexts/TagBoxContext";
import { TagTypes } from "../components/common/Card";
import DotIcon from "../utils/icons/DotIcon";
import Trash from "../utils/icons/Trash";

const CreateModal = () => {
  const { tags,setTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<TagTypes[]>([]);
  const { tagBox, setTagBox, handleTagBox } = useTagBox();
  const [tagInput, setTagInput] = useState("");

  const [contentType, setContentType] = useState<string>("document");

  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { handleModal } = useModal();
  const { setCards } = useCards();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleModal();
  };

  
  const handleDelete = async (id:string) => {
    try {
      const res = await axiosInstance.delete(`/api/v1/tag/${id}`);
      setTags((prevTags) => {
        return prevTags.filter((tag)=>(tag._id!=id)) 
      });
      setCards((prevCards)=>(prevCards.map((card)=>
        ({...card,tags:card.tags.filter((tag)=>tag._id!=id)}))))
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleCreateTag = async () => {
    if (tagInput.trim() === "") return; // Prevent empty tags
    try {
      const response = await axiosInstance.post("/api/v1/tag", {
        title: tagInput,
      });

      setTags((prev) => [...prev, response.data.data]);
      setSelectedTags((prev) => [...prev, response.data.data]);

      setTagInput(""); // Clear input after adding the tag
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

const handleSubmit = async () => {
  const title = titleRef.current?.value.trim();
  const content = contentRef.current?.value.trim();
  const link = linkRef.current?.value.trim();

  try {
    if (!content && !link) {
      return; 
    }

    const payload = { title, content, link, type: contentType,tags:selectedTags };

    const response = await axiosInstance.post("/api/v1/content/", payload);
    setCards((prev) => [...prev, response.data.data]);
    handleModal();
  } catch (error) {
    console.error("Error creating content:", error);
  }
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

  return (
    <div className="h-140 w-126 text-2xl scrollbar-none overflow-scroll relative text-amber-50 bg-slate-200 rounded-2xl p-4">
      <div
        onClick={(e) => (e.stopPropagation(), tagBox && handleTagBox(""))}
        className="flex flex-col gap-4 px-4 my-2"
      >
        <InputType ref={titleRef} placeholder="Title" type="text" />

        <InputTextArea
          placeholder={
            contentType !== "document" ? "Enter Link" : "Enter Content"
          }
          ref={contentRef}
        />

        <InputType ref={linkRef} placeholder="Link" type="link" />

        <span className="absolute right-2 top-6">
          <DotIcon
            onClick={(e) => (e.stopPropagation(), handleTagBox("data._id"))}
          />
        </span>
        {tagBox === "data._id" && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute overflow-scroll h-fit max-h-100 right-2 top-6 outline-none bg-slate-200 border border-gray-300 shadow-lg rounded-md p-2 w-62 z-50"
          >
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Search tags"
              className="w-full text-gray-500 text-sm p-1 border border-gray-400 rounded mb-2"
            />
            <div
              onClick={handleCreateTag}
              className="text-sm text-blue-600 cursor-pointer hover:underline pb-2"
            >
              + Create {tagInput ? `"${tagInput}"` : null}
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
                            e.stopPropagation(), handleDelete(tag._id)
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
                                e.stopPropagation(), handleDelete(tag._id)
                              )}
                              size="sm"
                            />
                          </div>
                        </div>
                      )
                  )}
            </div>
            <span className="flex justify-end">
              <Button
                onClick={() => {
                  setTagBox("");
                }}
                variant="primary"
                title="Close"
                size="sm"
              />
            </span>
          </div>
        )}

        {
          <div className="flex gap-x-1 flex-wrap gap-y-2">
            {selectedTags.map((tag) => (
              <span
                key={tag._id}
                className="flex px-2 py-1 justify-center items-center text-xs rounded-xl bg-purple-300 text-purple-600 hover:text-black"
              >
                {tag.title}
              </span>
            ))}
          </div>
        }

        <div className="flex gap-x-1 justify-center">
          {["Video", "Tweet", "Link", "Document"].map((type) => (
            <Button
              key={type}
              onClick={() => setContentType(type.toLowerCase())}
              variant={
                contentType === type.toLowerCase() ? "primary" : "secondary"
              }
              size="sm"
              title={type}
            />
          ))}
        </div>

        <span className="self-center flex gap-x-2 justify-center items-center">
          <Button
            onClick={handleClose}
            variant="secondary"
            size="md"
            title="Cancel"
          ></Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="md"
            title="Create"
          />
        </span>
      </div>
    </div>
  );
};

export default CreateModal;
