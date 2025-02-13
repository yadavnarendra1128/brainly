import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../contexts/UserContext";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  interface Data {
    email: string;
    password: string;
  }

  const { user, setUser } = useUser();
  const [data, setData] = useState<Data>({ email: "user123@gmail.com", password: "user@123" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUser = async (): Promise<void> => {
    try {
      const res = await axiosInstance.post("/api/v1/auth/login/", data);
      setUser(res.data.data);
      setError(null); // ✅ Clear error on success
    } catch (error: any) {
      if (error.response) {
        setError(
          error.response.data.error?.issues?.[0]?.message ||
            error.response.data.err?.issues?.[0]?.message ||
            error.response.data.msg ||
            "Login failed"
        ); // ✅ Capture backend error message
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-slate-50 h-screen w-screen flex justify-center items-center flex-col gap-y-4">
      <p className="text-lg text-gray-700">
        Login credentials are set. Click Login
      </p>
      <input
        type="text"
        name="email"
        value={data.email}
        onChange={inputChange}
        placeholder="Email"
        className="border p-2 rounded w-[20%]"
      />
      <div className="relative w-[20%]">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={data.password}
          onChange={inputChange}
          placeholder="Password"
          className="border p-2 rounded w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* ✅ Show error message */}
      <button
        onClick={fetchUser}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
