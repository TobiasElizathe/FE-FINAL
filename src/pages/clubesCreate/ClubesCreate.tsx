 import "./ClubesCreate.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosInstance from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";
import { useState } from "react";

type FormData = {
  nombre: string;
  pais: string;
  fundacion: string; // CORREGIDO: debe ser string para evitar errores
  estadio?: string;
  presidente?: string;
  titulosGanados?: number;
  colores?: string[];
  logoUrl?: string;
};

const validation = Joi.object<FormData>({
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre es obligatorio"
  }),
  pais: Joi.string().required().messages({
    "string.empty": "El país es obligatorio"
  }),
  fundacion: Joi.string().isoDate().required().messages({
    "string.empty": "La fecha de fundación es obligatoria",
    "string.isoDate": "Debe ser una fecha válida (yyyy-mm-dd)"
  }),
  estadio: Joi.string().required().messages({
    "string.empty": "El estadio es obligatorio"
  }),
  presidente: Joi.string().required().messages({
    "string.empty": "El presidente es obligatorio"
  }),
  titulosGanados: Joi.number().required().messages({
    "number.base": "Los títulos ganados son obligatorios"
  }),
  colores: Joi.array().items(Joi.string().min(1)).required().messages({
    "array.base": "Los colores son obligatorios"
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
      fundacion: new Date(values.fundacion), // CORREGIDO: convertir string en Date
      colores: values.colores?.filter((c) => c && c.trim() !== "") ?? [] // evitar [""] vacíos
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
            <input className="input-field" placeholder="Nombre" {...register("nombre")} />
            {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}
          </div>

          {/* País */}
          <div>
            <input className="input-field" placeholder="País" {...register("pais")} />
            {errors.pais && <span className="error-msg">{errors.pais.message}</span>}
          </div>

          {/* Fundación */}
          <div>
            <input className="input-field" type="date" {...register("fundacion")} />
            {errors.fundacion && <span className="error-msg">{errors.fundacion.message}</span>}
          </div>

          {/* Estadio */}
          <div>
            <input className="input-field" placeholder="Estadio" {...register("estadio")} />
            {errors.estadio && <span className="error-msg">{errors.estadio.message}</span>}
          </div>

          {/* Presidente */}
          <div>
            <input className="input-field" placeholder="Presidente" {...register("presidente")} />
            {errors.presidente && <span className="error-msg">{errors.presidente.message}</span>}
          </div>

          {/* Títulos Ganados */}
          <div>
            <input
              className="input-field"
              type="number"
              placeholder="Títulos ganados"
              {...register("titulosGanados")}
            />
            {errors.titulosGanados && <span className="error-msg">{errors.titulosGanados.message}</span>}
          </div>

          {/* Colores */}
          <div>
            <input
              className="input-field"
              placeholder="Colores (separados por coma)"
              {...register("colores", {
                setValueAs: (v: string) => v.split(",").map((s) => s.trim())
              })}
            />
            {errors.colores && <span className="error-msg">{errors.colores.message}</span>}
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