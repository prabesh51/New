// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    if (storedLoginStatus === "true" && storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
  }, []);

  const signup = async (email, password) => {
    try {
      setError(null);
      const response = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", email);
        setIsLoggedIn(true);
        setUser(email);
        return true;
      } else {
        setError(data.error || "Signup failed");
        return false;
      }
    } catch (err) {
      console.error("Signup request failed:", err);
      setError("Server error during signup");
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", email);
        setIsLoggedIn(true);
        setUser(email);
        return true;
      } else {
        setError(data.error || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Server error during login");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setError(null);
  };

  const value = {
    isLoggedIn,
    user,
    error,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
