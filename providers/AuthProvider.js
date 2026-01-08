"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← NEW: Track auth loading state
  const router = useRouter();

  // Load user from cookie on mount
  useEffect(() => {
    const loadUserFromCookie = () => {
      const cookie = Cookies.get("user");
      if (cookie) {
        try {
          const parsedUser = JSON.parse(cookie);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user cookie:", error);
          Cookies.remove("user");
        }
      }
      // Always set loading to false after attempting to load
      setLoading(false);
    };

    loadUserFromCookie();
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/login", { email, password });
      const loggedInUser = res.data.user;
      setUser(loggedInUser);
      Cookies.set("user", JSON.stringify(loggedInUser), { expires: 2 });
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
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);