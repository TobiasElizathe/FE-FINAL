import "./JugadoresCreate.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import axiosI from "../../config/axios";
import { TitleHeader } from "../../components/TitleHeader/TitleHeader";
import { useState, useEffect } from "react";

type FormData = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // Usaremos string para input date
  posicion: string;
  numeroCamiseta: number;
  photoUrl?: string; // FOTO del jugador
  club: string; // id del club
};
// Validación del formulario con Joi
const validation = Joi.object<FormData>({
  nombre: Joi.string().required().messages({ "string.empty": "El nombre es obligatorio" }),
  apellido: Joi.string().required().messages({ "string.empty": "El apellido es obligatorio" }),
  fechaNacimiento: Joi.date().required().messages({ "date.base": "Fecha inválida", "any.required": "Fecha de nacimiento es obligatoria" }),
  posicion: Joi.string().valid("Arquero", "Defensor", "Mediocampista", "Delantero").required().messages({ "any.only": "Posición inválida", "any.required": "La posición es obligatoria" }),
  numeroCamiseta: Joi.number().integer().min(1).max(99).required().messages({ "number.base": "Número inválido", "number.min": "Mínimo 1", "number.max": "Máximo 99", "any.required": "El número de camiseta es obligatorio" }),
  club: Joi.string().required().messages({ "string.empty": "El club es obligatorio" }),
    photoUrl: Joi.string().uri().allow("").optional().messages({"string.uri": "Debe ser una URL válida"}),
});

export const JugadoresCreate = () => {
// Inicialización del formulario con react-hook-form y validación Joi
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: joiResolver(validation) });

  const [serverErr, setServerErr] = useState<string | null>(null);
  const [clubs, setClubs] = useState<{ _id: string; name: string }[]>([]);
  const navigate = useNavigate();
  // Obtener usuario logueado del localStorage para permitir envío sino se desabilita la opcion de modificar
  const logged = JSON.parse(localStorage.getItem("user") || "null");
  const canSubmit = Boolean(logged);
// useEffect para traer la lista de clubes activos al montar el componente
useEffect(() => {
  (async () => {
    try {
      const res = await axiosI.get("/clubes/active");
      console.log("Clubes:", res.data.data); //  Esto va a mostrar los clubes
      setClubs(res.data.data);
    } catch (err) {
      console.error("Error al obtener clubes:", err);
    }
  })();
}, []);

// Función que se ejecuta al enviar el formulario con datos válidos
  const onSubmit = async (values: FormData) => {
    if (!logged) return;// No permite enviar si no hay usuario logueado
    setServerErr(null);

    try {
      // Envía la data al backend, convirtiendo fechaNacimiento a Date y agregando campos extra
      await axiosI.post("/jugadores", { ...values, fechaNacimiento: new Date(values.fechaNacimiento), isActive: true, createdAt: new Date() });
      navigate("/jugadores");// Redirige a listado de jugadores tras éxito
    } catch (e) {
      console.error("Error creando jugador:", e);
      setServerErr("Error al crear el jugador, intenta nuevamente.");
    }
  };

  return (
    <section className="jugadores-create-wrapper">
      <TitleHeader title="Nuevo Jugador" subtitle="Completá los datos del jugador" />

      <div className="jugadores-create-form">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* nombre */}
          <input
            className="input-field"
            placeholder="Nombre"
            {...register("nombre")}
          />
          {errors.nombre && <span className="error-msg">{errors.nombre.message}</span>}

          {/* apellido */}
          <input
            className="input-field"
            placeholder="Apellido"
            {...register("apellido")}
          />
          {errors.apellido && <span className="error-msg">{errors.apellido.message}</span>}

          {/* fechaNacimiento */}
          <input
            type="date"
            className="input-field"
            {...register("fechaNacimiento")}
          />
          {errors.fechaNacimiento && <span className="error-msg">{errors.fechaNacimiento.message}</span>}

          {/* posicion */}
          <select className="input-field" {...register("posicion")}>
            <option value="">Seleccioná posición</option>
            <option value="Arquero">Arquero</option>
            <option value="Defensor">Defensor</option>
            <option value="Mediocampista">Mediocampista</option>
            <option value="Delantero">Delantero</option>
          </select>
          {errors.posicion && <span className="error-msg">{errors.posicion.message}</span>}

          {/* numeroCamiseta */}
          <input
                type="number"
                className="input-field"
                placeholder="Número de camiseta"
                {...register("numeroCamiseta", {
                    valueAsNumber: true,
                    required: "El número de camiseta es obligatorio",
                    min: { value: 1, message: "Mínimo 1" },
                    max: { value: 99, message: "Máximo 99" },
                })}
                />
                {errors.numeroCamiseta && <span className="error-msg">{errors.numeroCamiseta.message}</span>}


          {/* club */}
          <select className="input-field" {...register("club")}>
            <option value="">Seleccioná club</option>
            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
          {errors.club && <span className="error-msg">{errors.club.message}</span>}

            {/* URL Foto */}
            <input
              className="input-field"
              placeholder="URL de la foto del jugador (opcional)"
              {...register("photoUrl")}
            />
            {errors.photoUrl && <span className="error-msg">{errors.photoUrl.message}</span>}


          {/* botón */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className={canSubmit ? "btn-primary" : "btn-disabled"}
          >
            {isSubmitting ? "Guardando…" : canSubmit ? "Guardar" : "Debe iniciar sesión"}
          </button>

          {/* error servidor */}
          {serverErr && <p className="error-msg">{serverErr}</p>}
        </form>
      </div>
    </section>
  );
};
