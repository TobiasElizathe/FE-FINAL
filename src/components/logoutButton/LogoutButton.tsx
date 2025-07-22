import React, { useState } from "react";
import { logoutUser } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";

export const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      // El contexto auth debe detectar el cambio automáticamente via onAuthStateChanged
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.userLoggedIn) return null; // No mostrar si no está logueado

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? "Cerrando sesión..." : "Logout"}
    </button>
  );
};
