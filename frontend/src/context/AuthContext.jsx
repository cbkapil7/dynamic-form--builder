import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore user safely and verify with server
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser && storedUser !== "undefined") {
          const parsed = JSON.parse(storedUser);

          if (parsed && parsed.id) {
            // Verify token is still valid by calling /auth/me
            try {
              const res = await api.get("/auth/me");
              if (res.data?.user) {
                setUser(res.data.user);
                setIsAuthenticated(true);
              } else {
                localStorage.removeItem("user");
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (err) {
              // Token invalid or expired
              localStorage.removeItem("user");
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);