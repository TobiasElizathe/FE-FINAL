// src/components/ClubesCard/ClubesCard.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";

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
  players: Jugador[] | string[]; // Se permite string[] para evitar errores

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
  const [jugadoresState, setJugadoresState] = useState<Jugador[]>([]);

  useEffect(() => {
    const cargarJugadores = async () => {
      // Si los jugadores son solo IDs, hay que pedirlos
      if (typeof players[0] === "string") {
        try {
          const res = await axiosInstance.get("/jugadores");
          const jugadoresDelClub = res.data.filter(
            (j: Jugador) =>
              (players as string[]).includes(j._id) || j.club === _id
          );
          setJugadoresState(jugadoresDelClub);
        } catch (error) {
          console.error("Error al cargar jugadores:", error);
        }
      } else {
        setJugadoresState(players as Jugador[]);
      }
    };

    cargarJugadores();
  }, [players, _id]);

  return (
    <div className="club-card">
      {logoUrl && (
        <img src={logoUrl} alt={`Escudo de ${name}`} className="club-escudo" />
      )}
      <h2 className="club-nombre">{name}</h2>
      {stadium && <p><strong>Estadio:</strong> {stadium}</p>}
      {president && <p><strong>Presidente:</strong> {president}</p>}
      {location && <p><strong>País:</strong> {location}</p>}
      {titlesWon && <p><strong>Títulos Ganados:</strong> {titlesWon}</p>}
      <p><strong>Fundación:</strong> {new Date(establishedAt).toLocaleDateString()}</p>

      <p><strong>Jugadores:</strong></p>
      {jugadoresState.length > 0 ? (
        <ul className="club-jugadores">
          {jugadoresState.map((j) => (
            <li key={j._id}>{j.nombre} {j.apellido}</li>
          ))}
        </ul>
      ) : (
        <p>No tiene jugadores asociados.</p>
      )}
    </div>
  );
};