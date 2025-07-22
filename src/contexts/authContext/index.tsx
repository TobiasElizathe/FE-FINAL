import { onAuthStateChanged } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import type { User } from "firebase/auth";

// Interfaces para los datos del usuario y el contexto
interface UserData {
  name: string;
  email: string;
}

interface AuthData {
  currentUser: UserData | null;
  userLoggedIn: boolean;
  loading: boolean;
}

// Crear el contexto con valor inicial nulo
const AuthContext = React.createContext<AuthData | null>(null);

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const initializeUser = (user: User | null) => {
    if (user) {
      setCurrentUser({
        name: user.displayName || "Usuario sin nombre",
        email: user.email || "Email no disponible"
      });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  };

  const value: AuthData = {
    currentUser,
    userLoggedIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
