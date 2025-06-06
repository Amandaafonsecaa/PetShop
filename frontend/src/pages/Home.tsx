import React, { useEffect, useState } from "react";
import NomeTela from "../components/ui/NomeTela";
import InfoCard from "../components/Home/InfoCard";
import type {
  Animal,
  Tutor,
  Pagamento,
  Funcionario,
} from "../types/interfaces";
import { Navbar } from "../components/Navbar";

// Importando os ícones
import iconePet from "../assets/icons/pet.png";
import iconeTutor from "../assets/icons/tutor.png";
import iconeFuncionarios from "../assets/icons/funcionarios.png";
import iconePendente from "../assets/icons/pendente.png";

export default function Home() {
  //definindo variasveis de estado
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
        <div className="navbar">
          <Navbar userName="Amanda" />
        </div>
        <div className="nome-tela">
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
        <div className="navbar">
          <Navbar userName="Amanda" />
        </div>
        <div className="nome-tela">
          <NomeTela message="Dashboard" />
        </div>
        <p style={{ textAlign: "center", fontSize: "1.2em" }}>
          Erro ao carregar dados: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="navbar">
        <Navbar userName="Amanda" />
      </div>
      <div className="nome-tela">
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
    </div>
  );
}
