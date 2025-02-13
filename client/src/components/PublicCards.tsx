import React, { useEffect, useState } from "react";
import PublicCard from "./common/PublicCard";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useCards } from "../contexts/CardContext";

const PublicCards: React.FC = () => {
  const { cards, setCards } = useCards();
  const { type } = useParams<{ type?: string }>();

  // const fetchAllContent = async (): Promise<void> => {
  //   try {
  //     const res = await axiosInstance.get("/api/v1/content/");
  //     setCards(res.data.data);
  //   } catch (error) {
  //     console.error("Error fetching all content:", error);
  //   }
  // };

  // const fetchTypeContent = async (): Promise<void> => {
  //   try {
  //     const res = await axiosInstance.get(`/api/v1/content/type/${type}`);
  //     setCards(res.data.data);
  //   } catch (error) {
  //     console.error(`Error fetching content for type "${type}":`, error);
  //   }
  // };

  // useEffect(() => {
  //   type ? fetchTypeContent() : fetchAllContent();
  // }, [type]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-10 py-2 px-16">
      {cards ? (
        cards.map((card) => <PublicCard key={card._id} data={card} />)
      ) : (
        <p className="text-center text-gray-500">No content available.</p>
      )}
    </div>
  );
};

export default PublicCards;
