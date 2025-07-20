import "./Navbar.css";
import LPF from "../../assets/LPF.png";
import { Link } from "react-router";

export const Navbar = () => {
  return (
  <nav className="navbar">
  <div className="logo">
    <Link to="/">
      <img src={LPF} alt="LPF" />
    </Link>
  </div>
        <ul>
              <li>
                <Link to="/clubes">Clubes</Link>
              </li>
              <li>
                <Link to="/clubesCreate">Crear Clubes</Link>
              </li>
              <li>
                <Link to="/jugadores">Jugadores</Link>
              </li>
                <li>
                    <Link to="/jugadoresCreate">Crear Jugadores</Link>
                </li>
        </ul>
    </nav>
  );
};