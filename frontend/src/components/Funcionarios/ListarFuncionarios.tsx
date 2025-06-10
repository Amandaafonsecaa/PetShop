import React from "react";
import type { Funcionario } from "../../types/interfaces";
import "./ListarFuncionario.css";

const listarFuncionarios: React.FC<Funcionario> = ({
  nome,
  telefone,
  cargo,
}) => {
  return (
    <div className={`listar-funcionario`}>
      <p id="nome">{nome}</p>
      <p id="telefone">{telefone}</p>
      <p id="cargo">{cargo}</p>
    </div>
  );
};

export default listarFuncionarios;
