import "./Clubes.css"; // el CSS adaptado debe tener las clases nuevas
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";
import { ClubCard } from "../../components/ClubesCard/ClubesCard";


export type Club = {
  _id: string;
  nombre: string;
  pais: string;
  fundacion: Date;
  presidente?: string;
  estadio?: string;
  titulosGanados?: number;
  colores: string[]; // <--- string, no string[
  jugadores: string[];
  logoUrl?: string;
  createdAt: string;
  updatedAt?: string;
};


export const Clubes = () => {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/clubes");
        setClubes(res.data.data);
        if (import.meta.env.DEV) console.log("Clubes fetched");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="post-wrapper">
      <TitleHeader title="Clubes" subtitle="Listado de clubes registrados" />

      <div className="post-links">
        {clubes.map((club) => (
          <ClubCard
            key={club._id}
            _id={club._id}
            nombre={club.nombre}
            pais={club.pais}
            fundacion={club.fundacion}
            jugadores={club.jugadores}
            presidente={club.presidente}
            estadio={club.estadio}
            titulosGanados={club.titulosGanados}
            colores={club.colores}
            logoUrl={club.logoUrl}
          />
        ))}
      </div>
    </section>
  );
};