import "./ClubesPanel.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";

// Definición del tipo de datos del formulario
type ClubFormData = {
  name: string;
  location: string;
  establishedAt: string; // yyyy-mm-dd
  president?: string;
  stadium?: string;
  titlesWon?: number;
  logoUrl?: string;
};

// Esquema de validación con Joi para los datos del club
const schema = Joi.object<ClubFormData>({
  name: Joi.string().required().messages({
    "string.empty": "El nombre es obligatorio",
  }),
  location: Joi.string().required().messages({
    "string.empty": "La ubicación es obligatoria",
  }),
  establishedAt: Joi.string()
    .isoDate()
    .required()
    .messages({
      "string.empty": "La fecha de fundación es obligatoria",
      "string.isoDate": "Debe ser una fecha válida",
    }),
  president: Joi.string().allow("").optional(),
  stadium: Joi.string().allow("").optional(),
  titlesWon: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": "Debe ser un número entero",
      "number.min": "No puede ser negativo",
    }),
  logoUrl: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Debe ser una URL válida",
  }),
});

export const ClubPanel = () => {
  const { id } = useParams();// Obtener el ID del club desde la URL
  const navigate = useNavigate();
// Estados para almacenar info del club, carga y errores
  const [clubInfo, setClubInfo] = useState<ClubFormData | null>(null);  
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
// Obtener usuario almacenado en localStorage para validar sesión
  const userStored = localStorage.getItem("user");
  const userRegistered = userStored ? JSON.parse(userStored) : null;
  // Inicialización del formulario con react-hook-form y validación Joi
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClubFormData>({
    resolver: joiResolver(schema),
  });
  // Efecto para cargar datos del club cuando cambia el ID
  useEffect(() => {
    const fetchClub = async () => {
      try {
        // Petición GET a la API para obtener datos del club
        const res = await axiosInstance.get(`/clubes/${id}`);
        const c = res.data.data;
        // Formatear datos recibidos y guardar en estado
        setClubInfo({
          name: c.name,
          location: c.location,
          establishedAt: new Date(c.establishedAt).toISOString().split("T")[0],
          president: c.president || "",
          stadium: c.stadium || "",
          titlesWon: c.titlesWon ?? undefined,
          logoUrl: c.logoUrl || "",
        });
      } catch (err) {
        setFetchError(err instanceof Error ? err : new Error("No se pudo cargar el club"));
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);
// Efecto para resetear el formulario con la info cargada del club
  useEffect(() => {
    if (clubInfo) {
      reset(clubInfo);
    }
  }, [clubInfo, reset]);
 // Función para enviar cambios del formulario a la API
  const saveChanges = async (values: ClubFormData) => {
    if (!userRegistered) return;

    try {
      // Preparar payload convirtiendo fecha a Date
      const payload = {
        ...values,
        establishedAt: new Date(values.establishedAt),
      };
      // Petición PUT para actualizar club en el backend
      await axiosInstance.put(`/clubes/update/${id}`, payload);
      // Redirigir a la lista de clubes tras éxito
      navigate("/clubes");
    } catch (err) {
      // Loguear error en consola (podría mostrarse mensaje al usuario)
      console.error("Error al modificar club:", err);
    }
  };

  return (
    <section className="panel-section">
      <TitleHeader title="Panel de Club" subtitle="Editá los datos del club" />

      <div className="panel-box">
        {loading ? (
          <p>Cargando club…</p>
        ) : fetchError ? (
          <p>Error: {fetchError.message}</p>
        ) : (
          <form onSubmit={handleSubmit(saveChanges)}>
            <input
              {...register("name")}
              className="panel-input"
              placeholder="Nombre"
            />
            {errors.name && <span>{errors.name.message}</span>}

            <input
              {...register("location")}
              className="panel-input"
              placeholder="Ubicación"
            />
            {errors.location && <span>{errors.location.message}</span>}

            <input
              {...register("establishedAt")}
              type="date"
              className="panel-input"
              placeholder="Fecha de fundación"
            />
            {errors.establishedAt && <span>{errors.establishedAt.message}</span>}

            <input
              {...register("president")}
              className="panel-input"
              placeholder="Presidente"
            />
            {errors.president && <span>{errors.president.message}</span>}

            <input
              {...register("stadium")}
              className="panel-input"
              placeholder="Estadio"
            />
            {errors.stadium && <span>{errors.stadium.message}</span>}

            <input
              {...register("titlesWon", { valueAsNumber: true })}
              type="number"
              min={0}
              className="panel-input"
              placeholder="Títulos ganados"
            />
            {errors.titlesWon && <span>{errors.titlesWon.message}</span>}

            <input
              {...register("logoUrl")}
              className="panel-input"
              placeholder="URL del logo"
            />
            {errors.logoUrl && <span>{errors.logoUrl.message}</span>}

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
