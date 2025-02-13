import React, { createContext, useContext, useState, ReactNode } from "react";
export interface TagTypes {
  _id: string;
  title: string;
  userId: string;
}
// 1️⃣ Card Type
interface CardTypes {
  _id: string;
  content: string;
  title: string;
  type: string;
  link: string;
  userId: string;
  tags: TagTypes[];
  createdAt: string;
}

// 2️⃣ Context Type
interface CardContextType {
  cards: CardTypes[];
  setCards: React.Dispatch<React.SetStateAction<CardTypes[]>>;
}

// 3️⃣ Default Value for Context
const defaultValue: CardContextType = {
  cards: [], // Initial empty array
  setCards: () => {}, // No-op function to avoid runtime errors
};

// 4️⃣ Create Context with Default Value
const CardContext = createContext<CardContextType>(defaultValue);

// 5️⃣ Provider Props Type
interface CardProviderProps {
  children: ReactNode;
}

// 6️⃣ CardProvider Component
const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const [cards, setCards] = useState<CardTypes[]>([]); // Initial empty state

  return (
    <CardContext.Provider value={{ cards, setCards }}>
      {children}
    </CardContext.Provider>
  );
};

// 7️⃣ Custom Hook
const useCards = (): CardContextType => {
  return useContext(CardContext); // No need to check for undefined now
};

export { CardProvider, useCards };
