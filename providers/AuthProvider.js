"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user from cookie
  useEffect(() => {
    const cookie = Cookies.get("user");
    if (cookie) {
      try {
        setUser(JSON.parse(cookie));
      } catch {
        Cookies.remove("user");
      }
    }
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/login", { email, password });
      setUser(res.data.user);
      Cookies.set("user", JSON.stringify(res.data.user), { expires: 2 });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
