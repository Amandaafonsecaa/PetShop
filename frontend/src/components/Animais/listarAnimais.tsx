import React from "react";
import type { Animal } from "../../types/interfaces";
import "./listarAnimais.css";

const listarAnimais: React.FC<Animal> = ({
  nomeAnimal,
  nomeTutor,
  raca,
  status_animal,
  sexo
}) => {
  const getStatusClassName = (status: string): string => {
    if (!status) return ""; 
    const statusNormalized = status.toLowerCase().replace(/\s+/g, "-"); // ex: "Agendada" -> "agendada"
    return `status-${statusNormalized}`; // Retorna ex: "status-agendada"
  };
  const statusClassName = getStatusClassName(status_animal);
  return(
    <div className={`listar-animal ${statusClassName}`}>
        <p id="nomeAnimal">{nomeAnimal}</p>
        <p id="nomeTutor">{nomeTutor}</p>
        <p id="raca">{raca}</p>
        <p id="status">{status_animal}</p>
        <p id="sexo">{sexo}</p>
    </div>
  );
};

export default listarAnimais;
