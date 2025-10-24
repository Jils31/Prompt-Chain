import { useState } from "react";
import Img from "../assets/premium_photo-1686052206568-c68b666691b3.avif";
import { useMutation } from '@tanstack/react-query';
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("Signup success", data);
      toast.success("Welcome to PromptChain");
      navigate("/chains");
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex w-[1100px] h-[700px] rounded-2xl overflow-hidden shadow-2xl">
        <div className="w-1/2">
          <img src={Img} alt="signup" className="h-full w-full object-cover" />
        </div>

        <div className="w-1/2 bg-[#121212] flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400 text-lg mb-10">
            Sign up to start creating workflows
          </p>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-base mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-4 text-lg bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:border-[#478C9D]"
              />
            </div>

            <div>
              <label className="block text-base mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full p-4 text-lg bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:border-[#478C9D]"
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
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-4 text-lg bg-[#478C9D] rounded-xl hover:bg-[#286A77] cursor-pointer transition-colors font-semibold"
            >
              {mutation.isPending ? "Signing Up" : "Sign Up"}
            </button>
          </form>

          <p className="text-base text-gray-400 mt-10">
            Already have an account?{" "}
            <a href="/login" className="text-[#478C9D] hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
