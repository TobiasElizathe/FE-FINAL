import "./TitleHeader.css";
import React from "react";

interface Props {
  title: string;
  subtitle: string;
}

export const TitleHeader: React.FC<Props> = ({ title, subtitle }) => (
  <header className="hdr">
    <h2 className="hdr__title">{title}</h2>
    <span className="hdr__subtitle">{subtitle}</span>
  </header>
);