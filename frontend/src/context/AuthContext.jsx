import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // restore user safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsed = JSON.parse(storedUser);

        if (parsed && parsed.id) {
          setUser(parsed);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Invalid user in localStorage");

        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (userData) => {
    if (!userData || typeof userData !== "object") {
      console.error("Invalid login data", userData);
      return;
    }

    const safeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    setUser(safeUser);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);