
import "./ClubesCard.css"; // Asegúrate de tener un archivo CSS para estilos
import { Link } from "react-router-dom";

interface Jugador {
  _id: string;
  nombre: string;
  apellido: string;
  club?: string;
}

interface ClubProps {
  _id: string;
  name: string;
  location: string;
  establishedAt: Date;
  stadium?: string;
  president?: string;
  titlesWon?: number;
  logoUrl?: string;
  players: Jugador[]; // ahora sólo Jugador[]
}

export const ClubCard = ({
  _id,
  name,
  stadium,
  location,
  president,
  titlesWon,
  establishedAt,
  logoUrl,
  players = [],
}: ClubProps) => {
  return (
    <div className="club-card">
      {logoUrl && (
        <img
          src={logoUrl}
          alt={`Escudo de ${name}`}
          className="club-escudo"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      )}
      <h2 className="club-nombre">{name}</h2>
      {stadium && <p><strong>Estadio:</strong> {stadium}</p>}
      {president && <p><strong>Presidente:</strong> {president}</p>}
      {location && <p><strong>País:</strong> {location}</p>}
      {titlesWon && <p><strong>Títulos Ganados:</strong> {titlesWon}</p>}
      <p><strong>Fundación:</strong> {new Date(establishedAt).toLocaleDateString()}</p>

      <p><strong>Jugadores:</strong></p>
      {players.length > 0 ? (
        <ul className="club-jugadores">
          {players.map((j) => (
            <li key={j._id}>{j.nombre} {j.apellido}</li>
          ))}
        </ul>
      ) : (
        <p>No tiene jugadores asociados.</p>
      )}

      <footer className="jugadorcard__foot">
        <Link to={`/clubesPanel/${_id}`} className="jugadorcard__link">
          editar
        </Link>
      </footer>
    </div>
  );
};
