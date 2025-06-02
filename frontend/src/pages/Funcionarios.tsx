import React, { useEffect, useMemo, useState } from "react";
import type { Funcionario } from "../types/interfaces";
import Navbar from "../components/Navbar";
import ListarFuncionarios from "../components/Funcionarios/ListarFuncionarios";
import BtnCrud from '../components/ui/BtnCrud'
import lupaIcon from '../assets/icons/lupa.png'
import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import './Funcionario.css'

export default function Funcionarios() {
  const [listaCompletaFuncionarios, setListaCompletaFuncionarios] = useState<
    Funcionario[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para o termo de pesquisa digitado pelo usuário
  const [termoDeBusca, setTermoDeBusca] = useState<string>("");

  // Estados para a funcionalidade "Ver mais / Ver menos"
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const LIMITE_INICIAL_FUNCIONARIOS = 3;

  // Estado para controlar o funcionário selecionado
  const [funcionarioSelecionado, setFuncionarioSelecionado] =
    useState<Funcionario | null>(null);

  useEffect(() => {
    const carregarFuncionarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const funcionariosResponse = await fetch(
          "http://localhost:3001/api/funcionarios"
        );

        if (!funcionariosResponse.ok) {
          throw new Error(
            `Falha ao buscar funcionários: ${funcionariosResponse.statusText}`
          );
        }

        const funcionariosDataBruta: any[] = await funcionariosResponse.json();
        console.log("1. Funcionários Brutos da API:", funcionariosDataBruta);

        const funcionariosProcessados: Funcionario[] =
          funcionariosDataBruta.map((funcBruto) => {
            return {
              id_funcionario: Number(funcBruto.id_funcionario),
              nome: funcBruto.nome,
              cargo: funcBruto.cargo,
              telefone: funcBruto.telefone,
              email: funcBruto.email,
              createdAt: funcBruto.createdAt
                ? new Date(funcBruto.createdAt)
                : undefined,
              updatedAt: funcBruto.updatedAt
                ? new Date(funcBruto.updatedAt)
                : undefined,
            };
          });

        console.log("2. Funcionários Processados:", funcionariosProcessados);
        setListaCompletaFuncionarios(funcionariosProcessados);
      } catch (err: any) {
        setError(
          err.message ||
            "Ocorreu um erro ao carregar os dados dos funcionários."
        );
        console.error("Erro ao buscar dados dos funcionários:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarFuncionarios();
  }, []);

  const funcionariosFiltrados = useMemo(() => {
    if (!termoDeBusca.trim()) {
      return listaCompletaFuncionarios;
    }

    const termoLower = termoDeBusca.toLowerCase().trim();

    return listaCompletaFuncionarios.filter((funcionario) => {
      const nomeFuncionarioLower = funcionario.nome?.toLowerCase() || "";
      const idFuncionarioString = funcionario.id_funcionario.toString();
      return (
        nomeFuncionarioLower.includes(termoLower) ||
        idFuncionarioString.includes(termoLower)
      );
    });
  }, [listaCompletaFuncionarios, termoDeBusca]);

  const funcionariosParaMostrar = mostrarTodos
    ? funcionariosFiltrados
    : funcionariosFiltrados.slice(0, LIMITE_INICIAL_FUNCIONARIOS);

  const handleSelectionFuncionario = (funcionario: Funcionario) => {
    if (funcionarioSelecionado?.id_funcionario === funcionario.id_funcionario) {
      setFuncionarioSelecionado(null);
    } else {
      setFuncionarioSelecionado(funcionario);
    }
  };

  const handleAcaoCrud = (acao: string) => {
    switch (acao) {
      case "adicionar":
        console.log("Adicionar novo funcionário");
        break;
      case "editar":
        if (funcionarioSelecionado) {
          console.log("Editar funcionário:", funcionarioSelecionado);
        }
        break;
      case "apagar":
        if (funcionarioSelecionado) {
          console.log("Apagar funcionário:", funcionarioSelecionado);
        }
        break;
      case "listar":
        if (funcionarioSelecionado) {
          console.log("Ver detalhes do funcionário:", funcionarioSelecionado);
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="funcionarios">
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Carregando funcionários...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="funcionarios">
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          Erro: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="funcionarios">
      <div className="navbar">
        <Navbar />
      </div>
      {/* Campo de Pesquisa (Lupa) */}
      <div className="barra-pesquisa-container">
        <img src={lupaIcon} alt="Lupa" className="icone-lupa" />
        <input
          type="text"
          placeholder="Pesquisar por ID ou Nome do funcionário..."
          className="input-pesquisa-funcionarios"
          value={termoDeBusca}
          onChange={(e) => {
            setTermoDeBusca(e.target.value);
            setMostrarTodos(false);
          }}
        />
      </div>
      {funcionarioSelecionado && (
        <div className="status-selecao">
          Funcionário selecionado: {funcionarioSelecionado.nome} (ID:{" "}
          {funcionarioSelecionado.id_funcionario})
        </div>
      )}
      <div className="funcoes-crud">
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar Funcionário"
          title="Adicionar"
          description="Cadastrar novo funcionário"
          onClick={() => handleAcaoCrud("adicionar")}
        />

        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar Funcionário"
          title="Apagar"
          description="Apagar um funcionário"
          onClick={() => handleAcaoCrud("apagar")}
          disabled={!funcionarioSelecionado}
        />
        <BtnCrud
          imageUrl={editarIcon}
          imageAlt="Editar Funcionário"
          title="Editar"
          description="Editar um funcionário"
          onClick={() => handleAcaoCrud("editar")}
          disabled={!funcionarioSelecionado}
        />
        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="Listar Funcionário"
          title="Listar"
          description="Listar funcionários"
          onClick={() => handleAcaoCrud("listar")}
          disabled={!funcionarioSelecionado}
        />
      </div>
      <div className="lista-funcionarios">
        {funcionariosParaMostrar.length > 0 ? (
          funcionariosParaMostrar.map((funcionario) => (
            <div
              key={funcionario.id_funcionario}
              onClick={() => handleSelectionFuncionario(funcionario)}
              className={`funcionario-card ${
                funcionarioSelecionado?.id_funcionario === funcionario.id_funcionario
                  ? "selecionado"
                  : ""
              }`}
            >
              <ListarFuncionarios {...funcionario} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            {termoDeBusca.trim() && listaCompletaFuncionarios.length > 0
              ? "Nenhum funcionário encontrado com este nome ou ID."
              : "Nenhum funcionário cadastrado."}
          </p>
        )}

        {/* Botões "Ver mais" / "Ver menos" */}
        {funcionariosFiltrados.length > LIMITE_INICIAL_FUNCIONARIOS && (
          <div className="botoes-paginacao">
            {!mostrarTodos ? (
              <button
                onClick={() => setMostrarTodos(true)}
                className="btn-ver-mais"
              >
                Ver mais ({funcionariosFiltrados.length - LIMITE_INICIAL_FUNCIONARIOS}{" "}
                restantes)
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
