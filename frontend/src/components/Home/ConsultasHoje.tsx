import React from "react";
import type { Consultas } from "../../types/interfaces";
import "./ConsultaHoje.css";

const ConsultasHoje: React.FC<Consultas> = ({
  nomeAnimal, // Nova prop
  nomeFuncionario, // Nova prop
  status_consulta,
  data_hora,
}) => {
  const dataObj = new Date(data_hora);
  {
    /*const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();*/
  }
  const horas = String(dataObj.getHours()).padStart(2, "0");
  const minutos = String(dataObj.getMinutes()).padStart(2, "0");
  {
    /*const dataFormatada = `${dia}/${mes}/${ano}`;*/
  }
  const horaFormatada = `${horas}:${minutos}`;

  const getStatusClassName = (status: string): string => {
    if (!status) return ""; // Caso o status seja nulo ou indefinido
    const statusNormalized = status.toLowerCase().replace(/\s+/g, "-"); // ex: "Agendada" -> "agendada"
    return `status-${statusNormalized}`; // Retorna ex: "status-agendada"
  };

  const statusClassName = getStatusClassName(status_consulta);

  return (
   
      <div className={`consulta-card ${statusClassName}`}>
        <p id="hora">{horaFormatada}</p>
        <p id="animal">{nomeAnimal}</p>
        <p id="funcionario">{nomeFuncionario}</p>
        <p id="status">{status_consulta}</p>
      </div>
    
  );
};

export default ConsultasHoje;
