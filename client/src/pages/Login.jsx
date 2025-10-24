import { useState } from "react";
import Img from '../assets/premium_photo-1686052206568-c68b666691b3.avif';
import { useMutation } from '@tanstack/react-query';
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login success", data);
      toast.success("Welcome back!");
      navigate("/chains");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted with:", formData);
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex w-[1100px] h-[650px] rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-1/2 bg-[#121212] flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold mb-3">Welcome back!</h1>
          <p className="text-gray-400 text-lg mb-10">
            Login to create unlimited workflows
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-base mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full p-4 text-lg bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:border-[#478C9D]"
                required
              />
            </div>

            <div>
              <label className="block text-base mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-4 text-lg bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:border-[#478C9D]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 text-lg bg-[#478C9D] rounded-xl hover:bg-[#286A77] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-base text-gray-400 mt-10">
            Don't have an account?{" "}
            <a href="/signup" className="text-[#478C9D] hover:underline">
              Sign up here
            </a>
          </p>
        </div>

        <div className="w-1/2">
          <img
            src={Img}
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}