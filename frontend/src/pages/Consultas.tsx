import React, { useEffect, useState, useMemo } from "react";

import BtnCrud from "../components/ui/BtnCrud";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import ConsultasHoje from "../components/Home/ConsultasHoje";

import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import lupaIcon from "../assets/icons/lupa.png";

import "./Consultas.css";

import { type Animal, type Funcionario, type Consultas } from "../types/interfaces";

export default function Consultas() {
  //definindo variasveis de estado
  const [consultas, setConsultas] = useState<Consultas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [listaCompletaConsultas, setListaCompletaConsultas] = useState<Consultas[]>([]);
  const [termoDeBusca, setTermoDeBusca] = useState<string>("");
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const LIMITE_INICIAL_CONSULTAS = 7;

  // Estado para controlar a consulta selecionada
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consultas | null>(null);

  // Função para lidar com a seleção de uma consulta
  const handleSelecionarConsulta = (consulta: Consultas) => {
    if (consultaSelecionada?.id_consulta === consulta.id_consulta) {
      setConsultaSelecionada(null); // Desseleciona se clicar na mesma consulta
    } else {
      setConsultaSelecionada(consulta); // Seleciona a nova consulta
    }
  };

  // Função para lidar com ações CRUD
  const handleAcaoCrud = (acao: string) => {
    switch (acao) {
      case 'adicionar':
        console.log('Adicionar nova consulta');
        break;
      case 'editar':
        if (consultaSelecionada) {
          console.log('Editar consulta:', consultaSelecionada);
        }
        break;
      case 'apagar':
        if (consultaSelecionada) {
          console.log('Apagar consulta:', consultaSelecionada);
        }
        break;
      case 'listar':
        if (consultaSelecionada) {
          console.log('Ver detalhes da consulta:', consultaSelecionada);
        }
        break;
      default:
        break;
    }
  };

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
        const mapaAnimais = new Map(
          animaisData.map((animal) => [animal.id_animal, animal.nomeAnimal])
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

  const consultasFiltradas = useMemo(() => {
    if(!termoDeBusca.trim()){
        return listaCompletaConsultas;
    }
    const termoLower = termoDeBusca.toLowerCase().trim();
    return listaCompletaConsultas.filter((consulta)=>{
        const nomeFuncionarioLower = consulta.nomeFuncionario?.toLowerCase() || "";
        const idFuncionarioString = consulta.id_funcionario.toString();
        return(
            nomeFuncionarioLower.includes(termoLower) ||
            idFuncionarioString.includes(termoLower)
            );
    });
  }, [listaCompletaConsultas, termoDeBusca]);

  const consultasParaExibir = mostrarTodos ? consultasFiltradas : consultasFiltradas.slice(0, LIMITE_INICIAL_CONSULTAS);

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
      </div>

      <div className="barra-pesquisa-container">
        <img src={lupaIcon} alt="Lupa" className="icone-lupa" />
        <input
          type="text"
          placeholder="Pesquisar por ID ou Nome do funcionário..."
          className="input-pesquisa-consultas"
          value={termoDeBusca}
          onChange={(e) => {
            setTermoDeBusca(e.target.value);
            setMostrarTodos(false); 
          }}
        />
      </div>

      {/* Status de seleção */}
      {consultaSelecionada && (
        <div className="status-selecao">
          Consulta selecionada: Animal {consultaSelecionada.nomeAnimal} com Dr(a). {consultaSelecionada.nomeFuncionario}
        </div>
      )}

      <div className="funcoes-crud">
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar"
          title="Adicionar"
          description="Adicionar uma consulta"
          onClick={() => handleAcaoCrud('adicionar')}
        />
        <BtnCrud
          imageUrl={editarIcon}
          imageAlt="Editar"
          title="Editar"
          description="Editar uma consulta já existente"
          onClick={() => handleAcaoCrud('editar')}
          disabled={!consultaSelecionada}
        />
        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar"
          title="Apagar"
          description="Apagar uma consulta existente"
          onClick={() => handleAcaoCrud('apagar')}
          disabled={!consultaSelecionada}
        />
        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="listar"
          title="Listar"
          description="Listar consultas"
          onClick={() => handleAcaoCrud('listar')}
          disabled={!consultaSelecionada}
        />
      </div>

      <div className="lista-consultas">
        {consultas.length > 0 ? (
          consultas.map((consultaItem) => (
            <div
              key={consultaItem.id_consulta || `${consultaItem.id_animal}-${consultaItem.data_hora}`}
              onClick={() => handleSelecionarConsulta(consultaItem)}
              className={`consulta-card ${consultaSelecionada?.id_consulta === consultaItem.id_consulta ? 'selecionado' : ''}`}
            >
              <ConsultasHoje
                id_animal={consultaItem.id_animal}
                nomeAnimal={consultaItem.nomeAnimal}
                id_funcionario={consultaItem.id_funcionario}
                nomeFuncionario={consultaItem.nomeFuncionario}
                status_consulta={consultaItem.status_consulta}
                data_hora={consultaItem.data_hora}
                preco={consultaItem.preco}
                diagnostico={consultaItem.diagnostico}
              />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            Nenhuma consulta agendada para hoje.
          </p>
        )}

        {/* Botões "Ver mais" / "Ver menos" */}
        {consultasFiltradas.length > LIMITE_INICIAL_CONSULTAS && (
          <div className="botoes-paginacao">
            {!mostrarTodos ? (
              <button
                onClick={() => setMostrarTodos(true)}
                className="btn-ver-mais"
              >
                Ver mais ({consultasFiltradas.length - LIMITE_INICIAL_CONSULTAS} restantes)
              </button>
            ) : (
              <button
                onClick={() => setMostrarTodos(false)}
                className="btn-ver-menos"
              >
                Ver menos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
