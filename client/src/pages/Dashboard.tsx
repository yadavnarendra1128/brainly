import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useModal } from "../contexts/ModalContext";
import { useTagBox } from "../contexts/TagBoxContext";

const Dashboard = () => {
  const { modal, handleModal } = useModal();
  const { setTagBox } = useTagBox();

  return (
    <div
      onClick={() => setTagBox("")}
      className="h-screen w-screen flex bg-slate-50 relative"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full h-full flex flex-col bg-slate-900">
        <Navbar />
        <div className="w-full h-full pt-4 overflow-auto scroll-smooth bg-slate-100">
          <Outlet />
        </div>
      </div>

      {/* Modal Overlay */}
      {modal && (
        <div
          className="fixed inset-0 flex justify-center items-center z-20"
          onClick={handleModal}
        >
          <div className="absolute inset-0 bg-slate-900 opacity-60"></div>
          <div
            className="relative z-30 inset-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Modal />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
