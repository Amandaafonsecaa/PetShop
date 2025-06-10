import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import InfoCard from "../components/Home/InfoCard";
import type {
  Animal,
  Tutor,
  Pagamento,
  Funcionario,
  Consultas,
} from "../types/interfaces";

// Importando os ícones
import iconePet from "../assets/icons/pet.png";
import iconeTutor from "../assets/icons/tutor.png";
import iconeFuncionarios from "../assets/icons/funcionarios.png";
import iconePendente from "../assets/icons/pendente.png";
import ConsultasHoje from "../components/Home/ConsultasHoje";

export default function Home() {
  //definindo variasveis de estado
  const [consultas, setConsultas] = useState<Consultas[]>([]);
  const [totalAnimais, setTotalAnimais] = useState<number | string>("...");
  const [totalTutores, setTotalTutores] = useState<number | string>("...");
  const [totalFuncionarios, setTotalFuncionarios] = useState<number | string>(
    "..."
  );
  const [contagemPagamentosPendentes, setContagemPagamentosPendentes] =
    useState<number>(0);

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
        setTotalAnimais(animaisData.length);

        //fetch tutores
        const tutoresResponse = await fetch(
          "http://localhost:3001/api/tutores"
        );
        if (!tutoresResponse.ok)
          throw new Error(
            `Falha ao buscar tutores: ${tutoresResponse.statusText}`
          );
        const tutoresData: Tutor[] = await tutoresResponse.json();
        setTotalTutores(tutoresData.length);

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
        setTotalFuncionarios(funcionarioData.length);

        //fetch pagamento
        const pagamentoResponse = await fetch(
          "http://localhost:3001/api/pagamentos"
        );
        if (!pagamentoResponse.ok)
          throw new Error(
            `Falha ao buscar pagamento: ${pagamentoResponse.statusText}`
          );
        const pagamentoData: Pagamento[] = await pagamentoResponse.json();

        const pagamentosPendentesArray = pagamentoData.filter(
          (p) => p.status_pagamento.toLowerCase() === "pendente"
        );
        setContagemPagamentosPendentes(pagamentosPendentesArray.length);

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
          (consultaOriginal) => ({
            ...consultaOriginal,
            id_animal: Number(consultaOriginal.id_animal),
            id_funcionario: Number(consultaOriginal.id_funcionario),
            preco: Number(consultaOriginal.preco),
            data_hora: consultaOriginal.data_hora,
            nomeAnimal:
              consultaOriginal.animal?.nome ||
              mapaAnimais.get(Number(consultaOriginal.id_animal)) ||
              "Animal não encontrado",
            nomeFuncionario:
              consultaOriginal.funcionario?.nome ||
              mapaFuncionarios.get(Number(consultaOriginal.id_funcionario)) ||
              "Funcionário não encontrado",
            id_consulta: Number(consultaOriginal.id_consulta),
            diagnostico: consultaOriginal.diagnostico,
            status_consulta: consultaOriginal.status_consulta,
            createdAt: consultaOriginal.createdAt,
            updatedAt: consultaOriginal.updatedAt
          })
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
  }, []); // Added dependency array

  const dashboardCardContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px", // Espaçamento entre os cards
    justifyContent: "center", // Ou 'flex-start', 'space-around', etc.
    padding: "20px 0", // Adiciona um pouco de preenchimento vertical
  };

  if (loading) {
    return (
      <div className="home">
        <Navbar />
        <div className="nome-tela-container">
          <NomeTela message="Dashboard" />
        </div>
        <p style={{ textAlign: "center", fontSize: "1.2em" }}>
          Carregando dados...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <Navbar />
        <div className="nome-tela-container">
          <NomeTela message="Dashboard" />
        </div>
        <p style={{ textAlign: "center", fontSize: "1.2em" }}>
          Erro ao carregar dados:
        </p>
      </div>
    );
  }

  return (
    <div className="home">
      <Navbar />
      <div className="nome-tela-container">
        <NomeTela message="Dashboard" />
      </div>
      <div className="dashboard-card" style={dashboardCardContainerStyle}>
        <InfoCard
          titulo="Total de Animais"
          valor={totalAnimais}
          icone={iconePet}
        />
        <InfoCard
          titulo="Total de Tutores"
          valor={totalTutores}
          icone={iconeTutor}
        />
        <InfoCard
          titulo="Total de Funcionários"
          valor={totalFuncionarios}
          icone={iconeFuncionarios}
        />
        <InfoCard
          titulo="Pagamentos Pendentes"
          valor={contagemPagamentosPendentes}
          icone={iconePendente}
        />
      </div>
      <div
        className="consultas-hoje"
        style={{ marginTop: "30px" }}
      >
        {" "}
        <NomeTela message="Consultas de Hoje" />
        {loading && <p>Carregando consultas...</p>}{" "}
        
        {!loading && error && (
          <p style={{ color: "red", textAlign: "center" }}>
            Erro ao carregar consultas: {error}
          </p>
        )}{" "}
        {!loading && !error && consultas.length > 0
          ? consultas.map((consultaItem) => (
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
          : // Só mostra "Nenhuma consulta" se não estiver carregando e não houver erro, e o array estiver vazio.
            !loading &&
            !error && (
              <p style={{ textAlign: "center" }}>
                Nenhuma consulta agendada para hoje.
              </p>
            )}
      </div>
    </div>
  );
}
