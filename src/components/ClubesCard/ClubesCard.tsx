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
  nombre: string;
  pais: string;
  fundacion: Date;
  estadio?: string;
  presidente?: string;
  titulosGanados?: number;  
  logoUrl?: string;
  jugadores?: Jugador[] | string[]; // Se permite string[] para evitar errores
  colores?: string[];
}

export const ClubCard = ({
  _id,
  nombre,
  estadio,
  presidente,
  fundacion,
  logoUrl,
  jugadores = [],
}: ClubProps) => {
  const [jugadoresState, setJugadoresState] = useState<Jugador[]>([]);

  useEffect(() => {
    const cargarJugadores = async () => {
      // Si los jugadores son solo IDs, hay que pedirlos
      if (typeof jugadores[0] === "string") {
        try {
          const res = await axiosInstance.get("/jugadores");
          const jugadoresDelClub = res.data.filter(
            (j: Jugador) =>
              (jugadores as string[]).includes(j._id) || j.club === _id
          );
          setJugadoresState(jugadoresDelClub);
        } catch (error) {
          console.error("Error al cargar jugadores:", error);
        }
      } else {
        setJugadoresState(jugadores as Jugador[]);
      }
    };

    cargarJugadores();
  }, [jugadores, _id]);

  return (
    <div className="club-card">
      {logoUrl && (
        <img src={logoUrl} alt={`Escudo de ${nombre}`} className="club-escudo" />
      )}
      <h2 className="club-nombre">{nombre}</h2>
      {estadio && <p><strong>Estadio:</strong> {estadio}</p>}
      {presidente && <p><strong>Presidente:</strong> {presidente}</p>}
      <p><strong>Fundación:</strong> {new Date(fundacion).toLocaleDateString()}</p>

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
