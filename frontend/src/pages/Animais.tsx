import React from "react";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import BtnCrud from "../components/ui/BtnCrud";

import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";

import './Animais.css'



export default function Animais() {
  return (
    <div className="animais">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="nome-tela">
        <NomeTela message="Animais" />
      </div>
      <div className="funcoes">
        <BtnCrud
          imageUrl={editarIcon}
          imageAlt="editar"
          title="Editar"
          description="Editar uma consulta já existente"
        />
        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar"
          title="Apagar"
          description="Apagar uma consulta existente"
        />
        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="listar"
          title="Listar"
          description="Listar consultas"
        />
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar"
          title="Adicionar"
          description="Adicionar uma consulta"
        />
      </div>
    </div>
  );
}
