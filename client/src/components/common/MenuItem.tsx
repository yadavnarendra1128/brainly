import { LucideProps } from "lucide-react"; // Example for Lucide Icons
import { cloneElement } from "react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  text: string;
  itemIcon?: React.ReactElement<LucideProps>; // Ensure itemIcon accepts size prop
  size?: "sm" | "md" | "lg" | "xl";
}

const Type: Record<string, string> = {
  Tweets: "types/tweet",
  Videos: "types/video",
  Documents: "types/document",
  Links: "types/link",
  Tags: "tags",
};

const MenuItem = ({ text, itemIcon, size }: MenuItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="py-2 cursor-pointer hover:bg-gray-100 px-6 md:px-4 lg:px-5"
      onClick={() => navigate(`/${Type[text]}`)}
    >
      <div className="flex gap-2 items-center">
        <span className="mt-0.5">
          {itemIcon && cloneElement(itemIcon, { size } as any)}
        </span>

        <span className="hidden md:block lg:block md:text-md lg:text-lg">
          {text}
        </span>
      </div>
    </div>
  );
};

export default MenuItem;
