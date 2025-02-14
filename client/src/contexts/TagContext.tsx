import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosInstance from "../utils/axiosInstance";

// 1️⃣ Tag Type
interface TagTypes {
  _id: string;
  title: string;
  userId: string;
}

// 2️⃣ Context Type
interface TagContextType {
  tags: TagTypes[];
  setTags: React.Dispatch<React.SetStateAction<TagTypes[]>>;
}

// 3️⃣ Default Value for Context
const defaultValue: TagContextType = {
  tags: [], // Initial empty array
  setTags: () => {}, // No-op function to avoid runtime errors
};

// 4️⃣ Create Context with Default Value
const TagContext = createContext<TagContextType>(defaultValue);

// 5️⃣ Provider Props Type
interface TagProviderProps {
  children: ReactNode;
}

// 6️⃣ TagProvider Component
const TagProvider: React.FC<TagProviderProps> = ({ children }) => {
  const [tags, setTags] = useState<TagTypes[]>([]); // Initial empty state
  

  return (
    <TagContext.Provider value={{ tags, setTags }}>
      {children}
    </TagContext.Provider>
  );
};

// 7️⃣ Custom Hook
const useTags = (): TagContextType => {
  return useContext(TagContext); // No need to check for undefined now
};

export { TagProvider, useTags };
