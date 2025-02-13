import React, { Ref } from "react";

interface Types {
  ref: Ref<HTMLTextAreaElement>;
  placeholder: string;
}

const InputTextArea: React.FC<Types> = ({ ref,placeholder }) => {
  return (
    <textarea
      placeholder={placeholder}
      ref={ref}
      className="text-black w-full border-2 border-slate-700 resize-none p-2 rounded-md h-70"
    ></textarea>
  );
};

export default InputTextArea;
