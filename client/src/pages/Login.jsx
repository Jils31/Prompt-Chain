import React from "react";
import Img from '../assets/premium_photo-1686052206568-c68b666691b3.avif'

export default function Login() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex w-[1100px] h-[650px] rounded-2xl overflow-hidden shadow-2xl">

        <div className="w-1/2 bg-[#121212] flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold mb-3">Welcome back!</h1>
          <p className="text-gray-400 text-lg mb-10">
            Login to create unlimited workflows
          </p>

          <form className="space-y-8">
            <div>
              <label className="block text-base mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full p-4 text-lg bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:border-[#478C9D]"
              />
            </div>

            <div>
              <label className="block text-base mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-4 text-lg bg-transparent border border-gray-600 rounded-xl focus:outline-none focus:border-[#478C9D]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 text-lg bg-[#478C9D] rounded-xl hover:bg-[#286A77] transition-colors font-semibold"
            >
              Log in
            </button>
          </form>

          <p className="text-base text-gray-400 mt-10">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#478C9D] hover:underline">
              Sign up here
            </a>
          </p>
        </div>

        <div className="w-1/2">
          <img
            src={Img}
            alt="music"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
