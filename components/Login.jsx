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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-4">
      <form
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transform transition-all duration-300 hover:shadow-2xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-semibold font-serif text-center text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text ">
          Login Here
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400"
            required
          />
          <div
            className="absolute right-3 top-12 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-[18px] font-serif bg-gradient-to-r from-blue-600 to-[#154c79] hover:from-blue-700 hover:to-[#154c79] text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
