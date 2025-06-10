import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import BtnCrud from "../components/ui/BtnCrud";
import Modal from "../components/ui/Modal";
import ListarTutores from "../components/Tutores/ListarTutores";

// Ícones
import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import lupaIcon from "../assets/icons/lupa.png";

import "./Tutores.css";
import type { Tutor } from "../types/interfaces";

interface TutorForm {
  nome: string;
  telefone: string;
  email: string;
}

export default function Tutores() {
  // Estado para TODOS os tutores carregados do backend
  const [listaCompletaTutores, setListaCompletaTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para o termo de pesquisa digitado pelo usuário
  const [termoDeBusca, setTermoDeBusca] = useState<string>("");

  // Estados para a funcionalidade "Ver mais / Ver menos"
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const LIMITE_INICIAL_TUTORES = 3;

  // Estado para controlar o tutor selecionado
  const [tutorSelecionado, setTutorSelecionado] = useState<Tutor | null>(null);

  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalApagar, setModalApagar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const [formData, setFormData] = useState<TutorForm>({
    nome: "",
    telefone: "",
    email: "",
  });

  const fetchDadosIniciais = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/tutores");
      if (!response.ok) {
        throw new Error(`Falha ao buscar tutores: ${response.statusText}`);
      }
      const tutoresData = await response.json();
      setListaCompletaTutores(tutoresData);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao carregar os dados.");
      console.error("Erro ao buscar dados iniciais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  // Lógica de Filtragem (Frontend)
  const tutoresFiltrados = useMemo(() => {
    const termoBusca = termoDeBusca.toLowerCase().trim();
    return listaCompletaTutores.filter((tutor) => {
      const idString = tutor.id_tutor?.toString() || "";
      return (
        tutor.nome.toLowerCase().includes(termoBusca) ||
        idString.includes(termoBusca)
      );
    });
  }, [listaCompletaTutores, termoDeBusca]);

  // Lógica de Paginação ("Ver mais/Ver menos")
  const tutoresParaExibir = useMemo(() => {
    if (mostrarTodos) {
      return tutoresFiltrados;
    }
    return tutoresFiltrados.slice(0, LIMITE_INICIAL_TUTORES);
  }, [tutoresFiltrados, mostrarTodos]);

  // Função para lidar com a seleção de um tutor
  const handleSelecionarTutor = (tutor: Tutor) => {
    if (tutorSelecionado?.id_tutor === tutor.id_tutor) {
      setTutorSelecionado(null);
    } else {
      setTutorSelecionado(tutor);
    }
  };

  // funções crud
  const handleAdicionarTutor = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!formData.nome || !formData.telefone || !formData.email) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Enviar para a API
      const response = await fetch("http://localhost:3001/api/tutores", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar tutor');
      }

      await fetchDadosIniciais();
      setModalAdicionar(false);
      setFormData({
        nome: "",
        telefone: "",
        email: "",
      });
      alert('Tutor adicionado com sucesso!');
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const handleEditarTutor = async () => {
    if (!tutorSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/tutores/${tutorSelecionado.id_tutor}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao editar tutor');
      }

      await fetchDadosIniciais();
      setModalEditar(false);
      setTutorSelecionado(null);
      alert('Tutor atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const handleApagarTutor = async () => {
    if (!tutorSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/tutores/${tutorSelecionado.id_tutor}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        await fetchDadosIniciais();
        setModalApagar(false);
        setTutorSelecionado(null);
        alert('Tutor removido com sucesso!');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao apagar tutor');
      }
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  // Função para lidar com ações CRUD
  const handleAcaoCrud = (acao: string) => {
    switch (acao) {
      case "adicionar":
        setModalAdicionar(true);
        break;
      case "editar":
        if (tutorSelecionado) {
          setFormData({
            nome: tutorSelecionado.nome || "",
            telefone: tutorSelecionado.telefone || "",
            email: tutorSelecionado.email || "",
          });
          setModalEditar(true);
        }
        break;
      case "apagar":
        if (tutorSelecionado) {
          setModalApagar(true);
        }
        break;
      case "listar":
        if (tutorSelecionado) {
          setModalDetalhes(true);
        }
        break;
      default:
        break;
    }
  };

  // Renderização de Loading e Error
  if (loading) {
    return (
      <div className="tutores-pagina">
        <Navbar /> <NomeTela message="Tutores" />
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Carregando tutores...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="tutores-pagina">
        <Navbar /> <NomeTela message="Tutores" />
        <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          Erro ao carregar tutores: {error}
        </p>
      </div>
    );
  }

  // JSX Principal
  return (
    <div className="tutores-pagina">
      <Navbar />
      <div className="nome-tela-container">
        <NomeTela message="Tutores Cadastrados" />
      </div>

      {/* Campo de Pesquisa (Lupa) */}
      <div className="barra-pesquisa-container">
        <img src={lupaIcon} alt="Lupa" className="icone-lupa" />
        <input
          type="text"
          placeholder="Pesquisar por ID ou Nome do tutor..."
          className="input-pesquisa-tutores"
          value={termoDeBusca}
          onChange={(e) => {
            setTermoDeBusca(e.target.value);
            setMostrarTodos(false);
          }}
        />
      </div>

      {/* Status de seleção */}
      {tutorSelecionado && (
        <div className="status-selecao">
          Tutor selecionado: {tutorSelecionado.nome} (ID: {tutorSelecionado.id_tutor})
        </div>
      )}

      <div className="funcoes-crud-tutores">
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar Tutor"
          title="Adicionar"
          description="Cadastrar novo tutor"
          onClick={() => handleAcaoCrud("adicionar")}
        />
        <BtnCrud
          imageUrl={editarIcon}
          imageAlt="Editar Tutor"
          title="Editar"
          description="Editar um tutor"
          onClick={() => handleAcaoCrud("editar")}
          disabled={!tutorSelecionado}
        />
        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar Tutor"
          title="Apagar"
          description="Apagar um tutor"
          onClick={() => handleAcaoCrud("apagar")}
          disabled={!tutorSelecionado}
        />
        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="Listar Tutor"
          title="Listar"
          description="Ver detalhes"
          onClick={() => handleAcaoCrud("listar")}
          disabled={!tutorSelecionado}
        />
      </div>

      <div className="lista-tutores-container">
        {tutoresParaExibir.length > 0 ? (
          tutoresParaExibir.map((tutor) => (
            <div
              key={tutor.id_tutor}
              onClick={() => handleSelecionarTutor(tutor)}
              className={`tutor-card ${
                tutorSelecionado?.id_tutor === tutor.id_tutor ? "selecionado" : ""
              }`}
            >
              <ListarTutores {...tutor} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            {termoDeBusca.trim() && listaCompletaTutores.length > 0
              ? "Nenhum tutor encontrado com este nome ou ID."
              : "Nenhum tutor cadastrado."}
          </p>
        )}

        {/* Botões "Ver mais" / "Ver menos" */}
        {tutoresFiltrados.length > LIMITE_INICIAL_TUTORES && (
          <div className="botoes-paginacao-tutores">
            {!mostrarTodos ? (
              <button
                onClick={() => setMostrarTodos(true)}
                className="btn-ver-mais"
              >
                Ver mais ({tutoresFiltrados.length - LIMITE_INICIAL_TUTORES}{" "}
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

      {/* Modal Adicionar */}
      <Modal
        isOpen={modalAdicionar}
        onClose={() => setModalAdicionar(false)}
        title="Adicionar Tutor"
      >
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="text"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalAdicionar(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleAdicionarTutor}>
            Adicionar
          </button>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar Tutor"
      >
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="text"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleEditarTutor}>
            Salvar
          </button>
        </div>
      </Modal>

      {/* Modal Apagar */}
      <Modal
        isOpen={modalApagar}
        onClose={() => setModalApagar(false)}
        title="Confirmar Exclusão"
      >
        <p>
          Tem certeza que deseja apagar o tutor{" "}
          <strong>{tutorSelecionado?.nome}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalApagar(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleApagarTutor}>
            Apagar
          </button>
        </div>
      </Modal>

      {/* Modal Detalhes */}
      <Modal
        isOpen={modalDetalhes}
        onClose={() => setModalDetalhes(false)}
        title="Detalhes do Tutor"
      >
        {tutorSelecionado && (
          <div>
            <p><strong>ID:</strong> {tutorSelecionado.id_tutor}</p>
            <p><strong>Nome:</strong> {tutorSelecionado.nome}</p>
            <p><strong>Telefone:</strong> {tutorSelecionado.telefone}</p>
            <p><strong>Email:</strong> {tutorSelecionado.email}</p>
            <p><strong>Criado em:</strong> {tutorSelecionado.createdAt ? new Date(tutorSelecionado.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <p><strong>Última atualização:</strong> {tutorSelecionado.updatedAt ? new Date(tutorSelecionado.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={() => setModalDetalhes(false)}>
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
}
