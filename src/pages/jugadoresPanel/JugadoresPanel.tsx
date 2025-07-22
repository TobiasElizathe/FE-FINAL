import "./JugadoresPanel.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";

type JugadorFormData = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // formato yyyy-mm-dd
  posicion: string;
  numeroCamiseta: number;
  photoUrl?: string; // FOTO del jugador
  club: string; // ID del club
};

const schema = Joi.object<JugadorFormData>({
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre es obligatorio",
  }),
  apellido: Joi.string().required().messages({
    "string.empty": "El apellido es obligatorio",
  }),
  fechaNacimiento: Joi.string().isoDate().required().messages({
    "string.empty": "La fecha de nacimiento es obligatoria",
    "string.isoDate": "Debe ser una fecha válida",
  }),
  posicion: Joi.string().required().messages({
    "string.empty": "La posición es obligatoria",
  }),
  numeroCamiseta: Joi.number().required().messages({
    "number.base": "El número de camiseta debe ser un número",
  }),
  club: Joi.string().required().messages({
    "string.empty": "Debe seleccionar un club",
  }),
  photoUrl: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Debe ser una URL válida",
  }),
});

export const JugadorPanel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jugadorInfo, setJugadorInfo] = useState<JugadorFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [clubes, setClubes] = useState<{ _id: string; name: string }[]>([]);

  const userStored = localStorage.getItem("user");
  const userRegistered = userStored ? JSON.parse(userStored) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JugadorFormData>({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    const fetchJugador = async () => {
      try {
        const res = await axiosInstance.get(`/jugadores/${id}`);
        const j = res.data.data;
        setJugadorInfo({
          nombre: j.nombre,
          apellido: j.apellido,
          fechaNacimiento: new Date(j.fechaNacimiento).toISOString().split("T")[0],
          posicion: j.posicion,
          numeroCamiseta: j.numeroCamiseta,
          club: j.club,
          photoUrl: j.photoUrl,
        });
      } catch (err) {
        setFetchError(err instanceof Error ? err : new Error("No se pudo cargar el jugador"));
      } finally {
        setLoading(false);
      }
    };

    const fetchClubes = async () => {
      try {
        const res = await axiosInstance.get("/clubes");
        setClubes(res.data.data);
      } catch (e) {
        console.error("Error cargando clubes", e);
      }
    };

    fetchJugador();
    fetchClubes();
  }, [id]);

  useEffect(() => {
    if (jugadorInfo) {
      reset(jugadorInfo);
    }
  }, [jugadorInfo, reset]);

  const saveChanges = async (values: JugadorFormData) => {
    if (!userRegistered) return;

    try {
      const payload = {
        ...values,
        fechaNacimiento: new Date(values.fechaNacimiento),
      };
      await axiosInstance.put(`/jugadores/update/${id}`, payload);
      navigate("/jugadores");
    } catch (err) {
      console.error("Error al modificar jugador:", err);
    }
  };

  return (
    <section className="panel-section">
      <TitleHeader
        title="Panel de Jugador"
        subtitle="Editá los datos del jugador"
      />

      <div className="panel-box">
        {loading ? (
          <p>Cargando jugador…</p>
        ) : fetchError ? (
          <p>Error: {fetchError.message}</p>
        ) : (
          <form onSubmit={handleSubmit(saveChanges)}>
            <input
              {...register("nombre")}
              className="panel-input"
              placeholder="Nombre"
            />
            {errors.nombre && <span>{errors.nombre.message}</span>}

            <input
              {...register("apellido")}
              className="panel-input"
              placeholder="Apellido"
            />
            {errors.apellido && <span>{errors.apellido.message}</span>}

            <input
              {...register("fechaNacimiento")}
              type="date"
              className="panel-input"
            />
            {errors.fechaNacimiento && <span>{errors.fechaNacimiento.message}</span>}

            <input
              {...register("posicion")}
              className="panel-input"
              placeholder="Posición"
            />
            {errors.posicion && <span>{errors.posicion.message}</span>}

            <input
              {...register("photoUrl")}
              className="panel-input"
              placeholder="URL de la foto del jugador (opcional)"
            />
            {errors.photoUrl && <span>{errors.photoUrl.message}</span>}


            <input
              {...register("numeroCamiseta")}
              type="number"
              className="panel-input"
              placeholder="Número de camiseta"
            />
            {errors.numeroCamiseta && <span>{errors.numeroCamiseta.message}</span>}

            <select {...register("club")} className="input-field">
            <option value="">Seleccionar club</option>
            {clubes.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
          {errors.club && <span className="error-msg">{errors.club.message}</span>}


            <button
              type="submit"
              className={!userRegistered ? "panel-btn--disabled" : "panel-btn"}
              disabled={!userRegistered}
            >
              {!userRegistered ? "Usuario no logueado" : "Guardar cambios"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
