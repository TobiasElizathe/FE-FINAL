import "./ClubesCard.css";
import { Link } from "react-router-dom";

export type ClubCardProps = {
  _id?: string;
  nombre: string;
  pais: string;
  fundacion: string; 
  presidente?: string;
  estadio?: string;
  titulosGanados?: number;
  colores?: string[];
  logoUrl?: string;
};

export const ClubCard: React.FC<ClubCardProps> = ({
  _id,
  nombre,
  pais,
  fundacion,
  presidente,
  estadio,
  titulosGanados,
  colores,
  logoUrl,

}) => {
  return (
    <article className="clubcard">
      <header className="clubcard__head">
        <img src={logoUrl} alt={`${nombre} logo`} className="clubcard__logo" />
        <h2 className="clubcard__name">{nombre}</h2>
      </header>

      <ul className="clubcard__info">
        <li>🌍 País: {pais}</li>
        <li>📅 Fundación: {new Date(fundacion).getFullYear()}</li>
        {presidente && <li>👤 Presidente: {presidente}</li>}
        {estadio && <li>🏟️ Estadio: {estadio}</li>}
        {titulosGanados !== undefined && <li>🏆 Títulos: {titulosGanados}</li>}
        {colores?.length && (
          <li>🎨 Colores: {colores.join(", ")}</li>
        )}
      </ul>

      <footer className="clubcard__foot">
        <Link to={`/clubesPanel/${_id}`} className="clubcard__link">
          editar
        </Link>
      </footer>
    </article>
  );
};