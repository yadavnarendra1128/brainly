import React, { ReactNode } from "react";
import CreateModal from "../pages/CreateModal";
import ShareModal from "../pages/ShareModal";
import ShareContentModal from "../pages/ShareContentModal";
import { useModal } from "../contexts/ModalContext";

const Modal = () => {
  const { modal } = useModal();
  switch (modal) {
    case "create":
      return <CreateModal />;

    case "share-content":
      return <ShareModal />;

    case "share-brain":
      return <ShareContentModal />;

    default:
      return null;
  }
};

export default Modal;
