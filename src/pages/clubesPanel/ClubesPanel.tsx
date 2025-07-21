import "./ClubesPanel.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";

type ClubFormData = {
  name: string;
  location: string;
  establishedAt: string; // yyyy-mm-dd
  president?: string;
  stadium?: string;
  titlesWon?: number;
  logoUrl?: string;
};

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
  const { id } = useParams();
  const navigate = useNavigate();

  const [clubInfo, setClubInfo] = useState<ClubFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);

  const userStored = localStorage.getItem("user");
  const userRegistered = userStored ? JSON.parse(userStored) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClubFormData>({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axiosInstance.get(`/clubes/${id}`);
        const c = res.data.data;

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

  useEffect(() => {
    if (clubInfo) {
      reset(clubInfo);
    }
  }, [clubInfo, reset]);

  const saveChanges = async (values: ClubFormData) => {
    if (!userRegistered) return;

    try {
      const payload = {
        ...values,
        establishedAt: new Date(values.establishedAt),
      };
      await axiosInstance.put(`/clubes/update/${id}`, payload);
      navigate("/clubes");
    } catch (err) {
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
