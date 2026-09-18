import { createContext, useContext, useState, type ReactNode } from "react";
import { getToken, setToken as storeToken, clearToken } from "@/lib/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getToken() !== null);
  const [email, setEmail] = useState<string | null>(
    () => localStorage.getItem("task_manager_email")
  );

  function login(token: string, userEmail: string) {
    storeToken(token);
    localStorage.setItem("task_manager_email", userEmail);
    setEmail(userEmail);
    setIsAuthenticated(true);
  }

  function logout() {
    clearToken();
    localStorage.removeItem("task_manager_email");
    setEmail(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un AuthProvider");
  }
  return context;
}
