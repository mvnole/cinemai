import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center px-4" style={{ backgroundImage: "url('/backgrounds/cinemai-register.jpg')" }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0" />

      <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded-lg max-w-md w-full text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Create your CinemAI account</h1>
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          // placeholder: you could save to localStorage or call backend API here
          navigate("/");
        }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-semibold transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-cyan-400 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;