import "./JugadoresCard.css";
import { Link } from "react-router-dom";

interface Club {
  _id: string;
  nombre: string;
}

export type JugadorCardProps = {
  _id?: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  posicion: string;
  numeroCamiseta: number;
  club: Club[] | string[];
};

export const JugadorCard: React.FC<JugadorCardProps> = ({
  _id,
  nombre,
  apellido,
  fechaNacimiento,
  posicion,
  numeroCamiseta,
  club,
}) => {
  const renderClub = () => {
    if (typeof club[0] === "string") {
      return (club as string[]).join(", ");
    } else {
      return (club as Club[]).map((c) => c.nombre).join(", ");
    }
  };

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
        {club && club.length > 0 && (
          <li>🏟️ Club: {renderClub()}</li>
        )}
      </ul>

      <footer className="jugadorcard__foot">
        <Link to={`/jugadoresPanel/${_id}`} className="jugadorcard__link">
          editar
        </Link>
      </footer>
    </article>
  );
};
