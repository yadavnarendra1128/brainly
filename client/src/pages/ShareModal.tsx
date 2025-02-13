import React, { useEffect, useRef, useState } from "react";
import CrossIcon from "../utils/icons/CrossIcon";
import Button from "../components/common/Button";
import { useModal } from "../contexts/ModalContext";

const ShareModal = () => {
  const { handleModal } = useModal();
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleModal();
  };

  const [shareLink, setShareLink] = useState<string | null>(null);

  const readFromClipboard = async () => {
    try {
      const res = await navigator.clipboard.readText();
      setShareLink(res);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  useEffect(() => {
    readFromClipboard();
  }, []);

  return shareLink ? (
    <div className="h-50 w-100 text-base text-amber-50 bg-slate-200 rounded-2xl cursor-pointer p-4">
      <div className="flex justify-between  items-center">
        <div className="justify-center text-xl text-purple-950">
          Link copied to your clipboard
        </div>
        <CrossIcon onClick={handleClose} size="xl" />
      </div>

      <p className="text-gray-800 break-words pt-4">{shareLink}</p>
      <div className="flex flex-col items-center justify-center gap-y-4 pt-4">
        <div className="flex gap-x-4 justify-center">
          <Button
            onClick={handleClose}
            variant="primary"
            size="md"
            title="Close"
          />
          <Button
            onClick={readFromClipboard}
            variant="secondary"
            size="md"
            title="Copy Link"
          />
        </div>
      </div>
    </div>
  ) : (
    <div> nO SHARE LINK</div>
  );
};

export default ShareModal;
