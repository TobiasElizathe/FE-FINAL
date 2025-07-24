import { useCallback, useState } from "react";
import styles from "./Register.module.css";
import { createUser } from "../../../firebase/auth"; // Importá la función de registro correcta
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();

  const handleRegister = useCallback(async () => {
    if (!isRegistering) {
      setIsRegistering(true);
      setError(null);
      try {
        // Intenta crear un nuevo usuario con el email y contraseña proporcionados usando Firebase.
        await createUser(email, password);
      } catch (err: any) {
        setError("Error al registrar usuario. Revisa tus datos.");
        console.error(err);
        setIsRegistering(false);
      }
    }
  }, [email, password, isRegistering]);

  if (auth?.userLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <h1>Register</h1>

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

      <button onClick={handleRegister} disabled={isRegistering}>
        {isRegistering ? "Registrando..." : "Register"}
      </button>

      <div>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};
