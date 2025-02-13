import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useCards } from "../contexts/CardContext";

const PublicDashboard = () => {
  const { link,userId } = useParams();
  const {setCards }=useCards()

  const fetchContent = async () => {
    const response = await axiosInstance.get(
      `/api/v1/content/shared/brain/${link}/${userId}`
    );
    setCards(response.data.content);
  };

  useEffect(() => {
    link && userId && fetchContent();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-slate-300 scrollbar-none overflow-scroll">
      <div className="w-full h-full pt-16 overflow-auto scroll-smooth bg-slate-100">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicDashboard;
