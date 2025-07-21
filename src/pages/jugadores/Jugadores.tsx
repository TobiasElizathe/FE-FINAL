import "./Jugadores.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";
import { JugadorCard } from "../../components/JugadoresCard/JugadoresCard";

export type Posicion = "Arquero" | "Defensor" | "Mediocampista" | "Delantero";

export type Club = {
  _id: string;
  nombre: string;
};

export type Jugador = {
  _id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  posicion: Posicion;
  numeroCamiseta: number;
  club: Club | string; // ✅ Puede ser objeto o ID
};
export const Jugadores = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await axiosInstance.get("/jugadores");
        setJugadores(response.data.data);
        if (import.meta.env.DEV) {
          console.log("Jugadores fetched:", response.data.data);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido al cargar jugadores.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJugadores();
  }, []);

  if (loading) {
    return (
      <section className="jugadores-wrapper">
        <p className="jugadores-loading">Cargando jugadores...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="jugadores-wrapper">
        <p className="jugadores-error">Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="jugadores-wrapper">
      <TitleHeader title="Jugadores" subtitle="Listado de jugadores registrados" />
      
      {jugadores.length === 0 ? (
        <p className="jugadores-empty">No hay jugadores registrados aún.</p>
      ) : (
        <div className="jugadores-list">
          {jugadores.map((jugador) => (
            <JugadorCard
              key={jugador._id}
              _id={jugador._id}
              nombre={jugador.nombre}
              apellido={jugador.apellido}
              fechaNacimiento={jugador.fechaNacimiento}
              posicion={jugador.posicion}
              numeroCamiseta={jugador.numeroCamiseta}
              club={jugador.club}
            />
          ))}
        </div>
      )}
    </section>
  );
};

