import React from "react";
import type { Tutor } from "../../types/interfaces";
import "./ListarTutores.css";

const ListarTutores: React.FC<Tutor> = ({
  nome,
  telefone,
  email,
}) => {
  return (
    <div className="listar-tutor">
      <p id="nome">{nome}</p>
      <p id="telefone">{telefone}</p>
      <p id="email">{email}</p>
    </div>
  );
};

export default ListarTutores; 