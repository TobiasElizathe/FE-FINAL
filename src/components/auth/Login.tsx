import { useCallback, useState } from "react";
import styles from "./Login.module.css";
import { signInUser } from "../../firebase/auth";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const handleLogin = useCallback(async () => {
    if (!isLoggingIn) {
      setIsLoggingIn(true);
      setError(null);
      try {
        await signInUser(email, password);
      } catch (err: any) {
        setError("Credenciales inválidas o error de conexión.");
        console.error(err);
        setIsLoggingIn(false);
      }
    }
  }, [email, password, isLoggingIn]);

  if (auth?.userLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>

      <input
        className={styles.textInput}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className={styles.textInput}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleLogin} disabled={isLoggingIn}>
        {isLoggingIn ? "Iniciando..." : "Login"}
      </button>

      <div>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </div>
  );
};
