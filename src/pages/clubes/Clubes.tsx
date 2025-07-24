import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { ClubCard } from "../../components/ClubesCard/ClubesCard";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";
import "./Clubes.css";

interface Jugador {
  _id: string;
  nombre: string;
  apellido: string;
  club: string;
}

interface Club {
  _id: string;
  name: string;
  stadium?: string;
  location: string;
  president?: string;
  titlesWon?: number;
  establishedAt: Date;
  logoUrl?: string;
  isActive: boolean;
  players: Jugador[];  // ya vienen con los jugadores incluidos
}

export const Clubes = () => {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const resClubes = await axiosInstance.get("/clubes");
      setClubes(resClubes.data.data);
    } catch (err) {
      setError("Error al cargar los clubes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();// Ejecuta fetchData una sola vez cuando el componente se monta
  }, []);

  // Función para activar o desactivar un club según su ID
  const toggleClubStatus = async (id: string, enable: boolean) => {
    setError(null);// Limpia errores anteriores
    setToggleId(id); // Marca el club que se está actualizando (para mostrar loading, por ejemplo)


    const endpoint = enable
      ? `/clubes/${id}/activate`
      : `/clubes/${id}/desactivate`;

    try {
      await axiosInstance.patch(endpoint);// Llama a la API para cambiar el estado del club
      setClubes((prev) =>
        prev.map((club) => (club._id === id ? { ...club, isActive: enable } : club))// Actualiza el estado del club localmente
      );
    } catch (err: any) {
      console.error("Error al actualizar estado:", err.response || err.message || err);
      setError(
        err.response?.data?.message || err.message || "No se pudo actualizar el estado."
      );
    } finally {
      setToggleId(null);// Limpia el ID del club que estaba siendo actualizado
    }
  };

  if (loading) return <p>Cargando clubes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section className="clubes-wrapper">
      <TitleHeader title="Clubes" subtitle="Listado de clubes registrados" />

      <div className="clubes-lista">
        {clubes.map((club) => {
          const isToggling = toggleId === club._id;

          return (
            <div key={club._id} className="clubes-item">
              <div className={`club-content ${!club.isActive ? "club-inactive" : ""}`}>
                <ClubCard {...club} players={club.players} />
              </div>

              <div className="jugadorcard_foot">
                <button
                  onClick={() => toggleClubStatus(club._id, true)}
                  disabled={club.isActive || isToggling}
                  title={club.isActive ? "Ya está activo" : "Activar club"}
                >
                  Activar
                </button>
                <button
                  onClick={() => toggleClubStatus(club._id, false)}
                  disabled={!club.isActive || isToggling}
                  title={!club.isActive ? "Ya está inactivo" : "Desactivar club"}
                >
                  Desactivar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
