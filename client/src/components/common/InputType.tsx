import React, { forwardRef, Ref } from "react";

interface InputProps {
  type: string;
  placeholder: string;
  ref:Ref<HTMLInputElement>;
}

const InputType:React.FC<InputProps>=({ type, placeholder, ref}) => {
    return (
      <input
        placeholder={placeholder}
        type={type}
        ref={ref}
        className="text-black text-sm w-full border-2 border-slate-700 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
      />
    );}

export default InputType;
