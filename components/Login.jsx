"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { ImSpinner2 } from "react-icons/im";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(form.email, form.password);

    setLoading(false);

    if (!res.success) {
      setError(res.error);
      toast.error(res.error);
      return;
    }

    toast.success("Login successful!");

    if (res?.user?.status === "admin") {
      router.push("/dashboard/leaddashboard");
    } else {
      router.push("/dashboard/leaddashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
      <form
        className="relative bg-white/90 backdrop-blur-md border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
        onSubmit={handleSubmit}
      >
        <div className="absolute inset-x-0 -top-[2px] h-[3px] bg-gradient-to-r from-[#154c79] to-[#124269] rounded-t-2xl" />

        <h2 className="text-3xl sm:text-4xl font-semibold font-serif text-center text-transparent bg-gradient-to-r from-[#154c79] to-[#124269] bg-clip-text tracking-tight">
          Login Here
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 p-2 rounded-lg shadow-sm">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <label className="block text-[18px] font-serif font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 sm:p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#154c79] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
            required
          />
        </div>

        <div className="space-y-2 relative">
          <label className="block text-[18px] font-serif font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 sm:p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#154c79] transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
            required
          />
          <div
            className="absolute right-3 top-11 sm:top-12 cursor-pointer text-gray-500 hover:text-[#154c79] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-[18px] font-serif bg-gradient-to-r from-[#154c79] to-[#0d3657] hover:from-[#0d3657] hover:to-[#123b5f] text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <ImSpinner2 className="animate-spin" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
