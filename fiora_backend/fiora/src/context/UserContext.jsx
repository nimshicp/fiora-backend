import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  registerUser,
  loginUser,
  logoutUser as logoutApiCall,
} from "../api/authApi";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);

      // Store Access Token (Interceptor uses this)
      localStorage.setItem("access", res.data.access);

      // Store User Data
        const userData = {
  id: res.data.id,
  username: res.data.username,
  role: res.data.role,
};
      
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      return userData; // Success return
    } catch (err) {
      console.error("Context Login Error:", err);
      return null; // Failure return
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      toast.success("Account created successfully!");
      return res.data;
    } catch (err) {
      toast.error("Registration failed. Please try again.");
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutApiCall(); // Clear backend cookie
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local state
      setUser(null);
      localStorage.removeItem("access");
      localStorage.removeItem("currentUser");
      window.location.replace("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, register, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
