 import "./ClubesCreate.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";
import { useState } from "react";

type FormData = {
  name: string;
  location: string;
  establishedAt: Date; // CORREGIDO: debe ser string para evitar errores
  stadium?: string;
  president?: string;
  titlesWon?: number;
  logoUrl?: string;
};

const validation = Joi.object<FormData>({
  name: Joi.string().required().messages({
    "string.empty": "El nombre es obligatorio"
  }),
  location: Joi.string().required().messages({
    "string.empty": "El país es obligatorio"
  }),
  establishedAt: Joi.string().isoDate().required().messages({
    "string.empty": "La fecha de fundación es obligatoria",
    "string.isoDate": "Debe ser una fecha válida (yyyy-mm-dd)"
  }),
  stadium: Joi.string().required().messages({
    "string.empty": "El estadio es obligatorio"
  }),
  president: Joi.string().required().messages({
    "string.empty": "El presidente es obligatorio"
  }),
  titlesWon: Joi.number().required().messages({
    "number.base": "Los títulos ganados son obligatorios"
  }),
  logoUrl: Joi.string().uri().required().messages({
    "string.empty": "La URL del logo es obligatoria",
    "string.uri": "Debe ser una URL válida"
  })
});

export const ClubCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({ resolver: joiResolver(validation) });

  const [serverErr, setServerErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const logged = JSON.parse(localStorage.getItem("user") || "null");
  const canSubmit = Boolean(logged);

  const onSubmit = async (values: FormData) => {
    if (!logged) return;
    setServerErr(null);

    const body = {
      ...values,
      establishedAt: new Date(values.establishedAt), // CORREGIDO: convertir string en Date
    };

    try {
      await axiosInstance.post("/clubes", body);
      navigate("/clubes");
    } catch (e) {
      console.error("Error creando club:", e);
      setServerErr("Error al crear el club. Intenta nuevamente.");
    }
  };

  return (
    <section className="club-create-wrapper">
      <TitleHeader title="Nuevo Club" subtitle="Completá los campos para registrar un club" />

      <div className="club-create-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre */}
          <div>
            <input className="input-field" placeholder="Nombre" {...register("name")} />
            {errors.name && <span className="error-msg">{errors.name.message}</span>}
          </div>

          {/* País */}
          <div>
            <input className="input-field" placeholder="País" {...register("location")} />
            {errors.location && <span className="error-msg">{errors.location.message}</span>}
          </div>

          {/* Fundación */}
          <div>
            <input className="input-field" type="date" {...register("establishedAt")} />
            {errors.establishedAt && <span className="error-msg">{errors.establishedAt.message}</span>}
          </div>

          {/* Estadio */}
          <div>
            <input className="input-field" placeholder="Estadio" {...register("stadium")} />
            {errors.stadium && <span className="error-msg">{errors.stadium.message}</span>}
          </div>

          {/* Presidente */}
          <div>
            <input className="input-field" placeholder="Presidente" {...register("president")} />
            {errors.president && <span className="error-msg">{errors.president.message}</span>}
          </div>

          {/* Títulos Ganados */}
          <div>
            <input
              className="input-field"
              type="number"
              placeholder="Títulos ganados"
              {...register("titlesWon")}
            />
            {errors.titlesWon && <span className="error-msg">{errors.titlesWon.message}</span>}
          </div>

          {/* Logo URL */}
          <div>
            <input className="input-field" placeholder="URL del logo" {...register("logoUrl")} />
            {errors.logoUrl && <span className="error-msg">{errors.logoUrl.message}</span>}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={canSubmit ? "btn-primary" : "btn-disabled"}
          >
            {isSubmitting ? "Creando…" : canSubmit ? "Crear Club" : "Debe iniciar sesión"}
          </button>

          {/* Error servidor */}
          {serverErr && <p className="error-msg">{serverErr}</p>}
        </form>
      </div>
    </section>
  );
};