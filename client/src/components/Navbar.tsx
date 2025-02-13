import Button from "./common/Button";
import { PlusIcon } from "../utils/icons/PlusIcon";
import { ShareIcon } from "../utils/icons/ShareIcon";
import axiosInstance from "../utils/axiosInstance";
import { useModal } from "../contexts/ModalContext";

const Navbar = () => {
  const { setModal } = useModal();

  const copyToClipboard = async (shareLink: string) => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleShare = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/content/share/brain`);
      const link =
        (import.meta.env.VITE_ENV == "production"
          ? import.meta.env.VITE_BACKEND_TARGET_URL
          : "http://localhost:5173") +
        "/shared/" +
        res.data.data;
      copyToClipboard(link);
      setModal(() => "share-brain");
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  return (
    <div className="py-4 px-4 w-full bg-slate-100 flex items-center justify-end">
      <div className="flex gap-x-4 px-4">
        <Button
          onClick={handleShare}
          variant={"primary"}
          startIcon={<ShareIcon size={"lg"} />}
          size="md"
          title={"Share Brain"}
        ></Button>
        <Button
          variant={"secondary"}
          startIcon={<PlusIcon size={"lg"} />}
          size="md"
          title={"Add Content"}
          onClick={() => setModal(() => "create")}
        ></Button>
      </div>
    </div>
  );
};

export default Navbar;
