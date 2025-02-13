import { useNavigate } from "react-router-dom";
import DocumentLogo from "../utils/icons/DocumentLogo";
import MenuItem from './common/MenuItem'
import Logo from "../utils/icons/Logo";
import TwitterLogo from "../utils/icons/TwitterLogo";
import YoutubeLogo from "../utils/icons/YoutubeLogo";
import LinkLogo from "../utils/icons/LinkLogo";
import TagLogo from "../utils/icons/TagLogo";
import Button from "./common/Button";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../contexts/UserContext";

const Sidebar = () => {
  const {user,setUser}=useUser();
  const handleLogOut = async() => {
    const res = await axiosInstance.post("/api/v1/auth/logout")
    setUser(null)
    navigate("/login");
  };

  const navigate = useNavigate();
  return (
    <div className="w-16 relative md:w-1/5 lg:w-1/6 xl:w-1/8 h-full flex flex-col py-2 bg-slate-50">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex gap-x-1 items-center py-4 justify-center md:justify-start px-4"
      >
        <Logo />
        <span className="hidden md:inline md:text-xl lg:text-2xl font-semibold text-purple-600">
          Brainly
        </span>
      </div>

      <div className="pt-4 w-full flex-col space-y-2">
        <MenuItem text={"Tweets"} itemIcon={<TwitterLogo />} size="md" />
        <MenuItem text={"Videos"} itemIcon={<YoutubeLogo />} size="md" />
        <MenuItem text={"Documents"} itemIcon={<DocumentLogo />} size="md" />
        <MenuItem text={"Links"} itemIcon={<LinkLogo />} size="md" />
        <MenuItem text={"Tags"} itemIcon={<TagLogo />} size="md" />
      </div>
      <div className="w-fit absolute bottom-3 cursor-pointer right-2"><Button onClick={handleLogOut} variant="primary" size="md" title="LogOut"/></div>
    </div>
  );
};

export default Sidebar;
