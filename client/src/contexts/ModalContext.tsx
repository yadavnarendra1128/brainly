import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axiosInstance from "../utils/axiosInstance";

interface ModalContextType {
  modal: string | null;
  setModal: React.Dispatch<React.SetStateAction<string | null>>;
  handleModal: ()=>void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider:React.FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = useState<string | null>(null);

  const handleModal = ()=>{
    modal && setModal(prevModal => (null));
  }

  return (
    <ModalContext.Provider value={{ modal,setModal,handleModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// 6️⃣ Custom hook for easier access
const useModal= (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export { ModalProvider, useModal };
