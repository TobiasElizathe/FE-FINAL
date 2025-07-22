import "./JugadoresCard.css";
import { Link } from "react-router-dom";

interface Club {
  _id: string;
  name: string;
  logoUrl?: string;
}

export type JugadorCardProps = {
  _id?: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  posicion: string;
  numeroCamiseta?: number;
  photoUrl?: string; // FOTO del jugador
  club: Club | string; // ⚠️ Puede ser un objeto Club o un string (id)
};

export const JugadorCard: React.FC<JugadorCardProps> = ({
  _id,
  nombre,
  apellido,
  fechaNacimiento,
  posicion,
  numeroCamiseta,
  photoUrl, // agrego aquí
  club,
}) => {
  const renderClub = () => {
    if (!club) return "Sin club asignado";
    if (typeof club === "string") return club;

    return (
      <span className="club-info">
        {club.logoUrl && (
          <img
            src={club.logoUrl}
            alt={`${club.name} logo`}
            className="club-logo"
            width={24}
            height={24}
            style={{ marginRight: 6, verticalAlign: "middle" }}
          />
        )}
        <span>{club.name}</span>
      </span>
    );
  };

  return (
    <article className="jugadorcard">
      <header className="jugadorcard__head">
        <h2 className="jugadorcard__name">
          {nombre} {apellido}
        </h2>
        <p className="jugadorcard__posicion">🧩 {posicion}</p>

        {/* Foto pequeña arriba a la derecha */}
        {photoUrl && (
          <img
            src={photoUrl}
            alt={`Foto de ${nombre}`}
            className="jugadorcard__photo"
          />
        )}
      </header>

      <ul className="jugadorcard__info">
        {numeroCamiseta ? <li>🎽 Camiseta N°: {numeroCamiseta}</li> : null}
        <li>🎂 Nacimiento: {new Date(fechaNacimiento).toLocaleDateString()}</li>
        {club && <li>🏟️ Club: {renderClub()}</li>}
      </ul>

      <footer className="jugadorcard__foot">
        <Link to={`/jugadoresPanel/${_id}`} className="jugadorcard__link">
          editar
        </Link>
      </footer>
    </article>
  );
};
