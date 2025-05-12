"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user cookie");
        Cookies.remove("user");
      }
    }
  }, []);
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/login", { email, password });
      const userData = res.data.user;

      // Save to state and cookie (expires in 2 days)
      setUser(userData);
      Cookies.set("user", JSON.stringify(userData), { expires: 2 });

      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
