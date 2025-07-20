import "./JugadorCard.css";
import { Link } from "react-router-dom";

export type JugadorCardProps = {
  _id?: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  posicion: "Arquero" | "Defensor" | "Mediocampista" | "Delantero";
  numeroCamiseta: number;
  clubNombre?: string;
};

export const JugadorCard: React.FC<JugadorCardProps> = ({
  _id,
  nombre,
  apellido,
  fechaNacimiento,
  posicion,
  numeroCamiseta,
  clubNombre,
}) => {
  return (
    <article className="jugadorcard">
      <header className="jugadorcard__head">
        <h2 className="jugadorcard__name">
          {nombre} {apellido}
        </h2>
        <p className="jugadorcard__posicion">🧩 {posicion}</p>
      </header>

      <ul className="jugadorcard__info">
        <li>🎽 Camiseta N°: {numeroCamiseta}</li>
        <li>🎂 Nacimiento: {new Date(fechaNacimiento).toLocaleDateString()}</li>
        {clubNombre && <li>🏟️ Club: {clubNombre}</li>}
      </ul>

      <footer className="jugadorcard__foot">
        <Link to={`/jugadoresPanel/${_id}`} className="jugadorcard__link">
          editar
        </Link>
      </footer>
    </article>
  );
};
