import { useContext, useState } from "react";
import { createContext } from "react"; // ✅ Correct

interface TagBoxContext {
    tagBox: string;  // state
    setTagBox: React.Dispatch<React.SetStateAction<string>>;
    handleTagBox: (id:string) => void; 
}

interface TagBoxProviderProps {
    children: React.ReactNode;
}

const TagBoxContext = createContext<TagBoxContext | "">("")

const TagBoxProvider:React.FC<TagBoxProviderProps> = ({children})=>{
    const [tagBox, setTagBox] = useState<string>("");

    const handleTagBox = (id:string) => {
      id==tagBox ? setTagBox("") : setTagBox(id)
    };

    return (
        <TagBoxContext.Provider value={{tagBox,setTagBox,handleTagBox}}>
            {children}
        </TagBoxContext.Provider>
    )
}

const useTagBox = ()=>{
    const context = useContext(TagBoxContext)
    if (!context) {
      throw new Error("useTagBox must be used within a TagBoxProvider");
    }

    return context  // return the state and methods to be used by the children components.  This is a custom hook.  It is a way to get access to the context without having to pass it as props.  The context is used to share data and functionality among components without passing props down the tree.  This is a great way to avoid prop drilling.  It is also a way to enforce a single source of truth for
}
export { useTagBox, TagBoxProvider }