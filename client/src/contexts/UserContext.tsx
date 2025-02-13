import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosInstance from "../utils/axiosInstance";

// 1️⃣ Define the User type
interface User {
  name: string;
  email: string;
  userId:string;
  username:string
}

// 2️⃣ Define the context type
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// 3️⃣ Create the context with an initial value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4️⃣ Define the Provider props type
interface UserProviderProps {
  children: ReactNode;
}

// 5️⃣ UserProvider Component
const UserProvider:React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (): Promise<void> => {
    const res = await axiosInstance.get("/api/v1/auth/");
    setUser(res.data.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 6️⃣ Custom hook for easier access
const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Export both UserProvider and useUser
export { UserProvider, useUser };
