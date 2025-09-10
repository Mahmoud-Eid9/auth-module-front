// context/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
} | undefined;

const AuthContext = createContext<AuthContextType>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context){
      throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
