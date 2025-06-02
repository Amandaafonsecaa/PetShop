import React, { useEffect, useState } from "react";

import BtnCrud from "../components/ui/BtnCrud";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import ConsultasHoje from "../components/Home/ConsultasHoje";

import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";

import "./Consultas.css";

import type { Animal, Funcionario, Consultas } from "../types/interfaces";

export default function Consultas() {
  //definindo variasveis de estado
  const [consultas, setConsultas] = useState<Consultas[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //conectar ao banco
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        //fetch animais
        const animaisResponse = await fetch(
          "http://localhost:3001/api/animais"
        );
        if (!animaisResponse.ok)
          throw new Error(
            `Falha ao buscar animais: ${animaisResponse.statusText}`
          );
        const animaisData: Animal[] = await animaisResponse.json();

        //fetch funcionários
        const funcionariosResponse = await fetch(
          "http://localhost:3001/api/funcionarios"
        );
        if (!funcionariosResponse.ok)
          throw new Error(
            `Falha ao buscar funcionário: ${funcionariosResponse.statusText}`
          );
        const funcionarioData: Funcionario[] =
          await funcionariosResponse.json();

        //fetch consultas
        const consultasResponse = await fetch(
          "http://localhost:3001/api/consultas"
        );
        if (!consultasResponse.ok)
          throw new Error(
            `Falha ao buscar consultas: ${consultasResponse.statusText}`
          );
        const consultasData: Consultas[] = await consultasResponse.json();
        const hojeString = new Date().toDateString();
        const consultasFiltradas = consultasData.filter((c) => {
          if (!c.data_hora) return false;
          const dataConsulta = new Date(c.data_hora);
          if (isNaN(dataConsulta.getTime())) {
            console.warn(
              "Data da consulta inválida ou em formato não reconhecido:"
            );
            return false; // Descarta datas inválidas
          }
          return dataConsulta.toDateString() === hojeString;
        });

        // Criar mapas para busca rápida de nomes (MUITO mais eficiente que .find() em loops)
        // Adapte 'id_animal' e 'nome' para os nomes corretos dos campos nas suas interfaces Animal e Funcionario
        const mapaAnimais = new Map(
          animaisData.map((animal) => [animal.id_animal, animal.nome])
        );
        const mapaFuncionarios = new Map(
          funcionarioData.map((func) => [func.id_funcionario, func.nome])
        );

        const consultasEnriquecidas: Consultas[] = consultasFiltradas.map(
          (consultaOriginal: any) => {
            return {
              // Espalhe as propriedades originais da consulta
              ...consultaOriginal,
              // Garanta que os tipos dos IDs estejam corretos se necessário
              id_animal: Number(consultaOriginal.id_animal),
              id_funcionario: Number(consultaOriginal.id_funcionario),
              preco: Number(consultaOriginal.preco),
              data_hora: consultaOriginal.data_hora, // Já é string ou pode ser new Date(consultaOriginal.data_hora)
              // Adicione os nomes encontrados
              nomeAnimal:
                mapaAnimais.get(Number(consultaOriginal.id_animal)) ||
                "Animal não encontrado",
              nomeFuncionario:
                mapaFuncionarios.get(Number(consultaOriginal.id_funcionario)) ||
                "Funcionário não encontrado",
              // Se você tiver um id_consulta vindo do backend, inclua aqui também
              // id_consulta: consultaOriginal.id_consulta // Exemplo
            };
          }
        );

        setConsultas(consultasEnriquecidas);
      } catch (err: any) {
        const errorMessage =
          err.message || "Ocorreu um erro ao carregar os dados do dashboard.";
        setError(errorMessage);
        console.error("Erro ao buscar dados para o dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="consultas">
        <div className="nome-tela">
          <NomeTela message="Consultas" />
        </div>
        <p>Carregando consultas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consultas">
        <div className="nome-tela">
          <NomeTela message="Consultas" />
        </div>
        <p style={{ color: "red" }}>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="consultas">
      <div className="navbar">
        <Navbar />
      </div>

      <div className="consultas-hoje">
        <NomeTela message="Consultas de Hoje" />
        {consultas.length > 0 ? (
          consultas.map((consultaItem) => (
            <ConsultasHoje
              key={
                consultaItem.id_consulta ||
                `${consultaItem.id_animal}-${consultaItem.data_hora}`
              }
              id_animal={consultaItem.id_animal}
              nomeAnimal={consultaItem.nomeAnimal}
              id_funcionario={consultaItem.id_funcionario}
              nomeFuncionario={consultaItem.nomeFuncionario}
              status_consulta={consultaItem.status_consulta}
              data_hora={consultaItem.data_hora}
              preco={consultaItem.preco}
              diagnostico={consultaItem.diagnostico}
            />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            Nenhuma consulta agendada para hoje.
          </p>
        )}
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
