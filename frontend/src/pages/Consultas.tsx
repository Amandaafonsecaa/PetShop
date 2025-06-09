import React, { useEffect, useState, useMemo } from "react";

import BtnCrud from "../components/ui/BtnCrud";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import ConsultasHoje from "../components/Home/ConsultasHoje";
import Modal from "../components/ui/Modal";

import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import lupaIcon from "../assets/icons/lupa.png";

import "./Consultas.css";

import {
  type Animal,
  type Funcionario,
  type Consultas,
} from "../types/interfaces";

interface ConsultaForm {
  id_consulta: number;
  id_animal: number;
  id_funcionario: number;
  data_hora: Date;
  diagnostico: string | null;
  status_consulta: 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento';
  preco: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Consultas() {
  //definindo variasveis de estado
  const [consultas, setConsultas] = useState<Consultas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [listaCompletaConsultas] = useState<Consultas[]>([]);
  const [termoDeBusca, setTermoDeBusca] = useState<string>("");
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const LIMITE_INICIAL_CONSULTAS = 7;

  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalApagar, setModalApagar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const[formData, setFormData] = useState<ConsultaForm>({
    id_consulta: 0,
    id_animal: 0,
    id_funcionario: 0,
    data_hora: new Date(),
    diagnostico: null,
    status_consulta: "Agendada",
    preco: 0
  });

  // Estado para controlar a consulta selecionada
  const [consultaSelecionada, setConsultaSelecionada] =
    useState<Consultas | null>(null);

  // Função para lidar com a seleção de uma consulta
  const handleSelecionarConsulta = (consulta: Consultas) => {
    if (consultaSelecionada?.id_consulta === consulta.id_consulta) {
      setConsultaSelecionada(null); // Desseleciona se clicar na mesma consulta
    } else {
      setConsultaSelecionada(consulta); // Seleciona a nova consulta
    }
  };

  // Funções CRUD
  const handleAdicionarConsulta = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!formData.id_animal || !formData.id_funcionario || !formData.data_hora || !formData.preco) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const response = await fetch("http://localhost:3001/api/consultas", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar consulta');
      }

      await fetchDashboardData();
      setModalAdicionar(false);
      setFormData({
        id_consulta: 0,
        id_animal: 0,
        id_funcionario: 0,
        data_hora: new Date(),
        diagnostico: null,
        status_consulta: 'Agendada',
        preco: 0,
        createdAt: undefined,
        updatedAt: undefined
      });
      alert('Consulta adicionada com sucesso!');
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const handleEditarConsulta = async () => {
    if (!consultaSelecionada) return;

    try {
      const response = await fetch(`http://localhost:3001/api/consultas/${consultaSelecionada.id_consulta}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao editar consulta');
      }

      await fetchDashboardData();
      setModalEditar(false);
      setConsultaSelecionada(null);
      alert('Consulta atualizada com sucesso!');
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const handleApagarConsulta = async () => {
    if (!consultaSelecionada) return;

    try {
      const response = await fetch(`http://localhost:3001/api/consultas/${consultaSelecionada.id_consulta}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        await fetchDashboardData();
        setModalApagar(false);
        setConsultaSelecionada(null);
        alert('Consulta removida com sucesso!');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao apagar consulta');
      }
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const handleAcaoCrud = (acao: string) => {
    switch (acao) {
      case "adicionar":
        setModalAdicionar(true);
        break;
      case "editar":
        if (consultaSelecionada) {
          setFormData({
            id_consulta: consultaSelecionada.id_consulta,
            id_animal: consultaSelecionada.id_animal,
            id_funcionario: consultaSelecionada.id_funcionario,
            data_hora: new Date(consultaSelecionada.data_hora),
            diagnostico: consultaSelecionada.diagnostico,
            status_consulta: consultaSelecionada.status_consulta as 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento',
            preco: Number(consultaSelecionada.preco),
            createdAt: consultaSelecionada.createdAt ? new Date(consultaSelecionada.createdAt) : undefined,
            updatedAt: consultaSelecionada.updatedAt ? new Date(consultaSelecionada.updatedAt) : undefined
          });
          setModalEditar(true);
        }
        break;
      case "apagar":
        if (consultaSelecionada) {
          setModalApagar(true);
        }
        break;
      case "listar":
        if (consultaSelecionada) {
          setModalDetalhes(true);
        }
        break;
      default:
        break;
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch animais
      const animaisResponse = await fetch("http://localhost:3001/api/animais");
      if (!animaisResponse.ok) {
        throw new Error(`Falha ao buscar animais: ${animaisResponse.statusText}`);
      }
      const animaisData: Animal[] = await animaisResponse.json();
      console.log('Animais carregados:', animaisData); // Debug
      setAnimais(animaisData);

      // Fetch funcionários
      const funcionariosResponse = await fetch("http://localhost:3001/api/funcionarios");
      if (!funcionariosResponse.ok) {
        throw new Error(`Falha ao buscar funcionário: ${funcionariosResponse.statusText}`);
      }
      const funcionarioData: Funcionario[] = await funcionariosResponse.json();
      console.log('Funcionários carregados:', funcionarioData); // Debug
      setFuncionarios(funcionarioData);

      // Fetch consultas
      const consultasResponse = await fetch("http://localhost:3001/api/consultas");
      if (!consultasResponse.ok) {
        throw new Error(`Falha ao buscar consultas: ${consultasResponse.statusText}`);
      }
      const consultasData: Consultas[] = await consultasResponse.json();
      
      const hojeString = new Date().toDateString();
      const consultasFiltradas = consultasData.filter((c) => {
        if (!c.data_hora) return false;
        const dataConsulta = new Date(c.data_hora);
        return !isNaN(dataConsulta.getTime()) && dataConsulta.toDateString() === hojeString;
      });

      const consultasEnriquecidas: Consultas[] = consultasFiltradas.map((consultaOriginal) => ({
        ...consultaOriginal,
        id_animal: Number(consultaOriginal.id_animal),
        id_funcionario: Number(consultaOriginal.id_funcionario),
        preco: Number(consultaOriginal.preco),
        nomeAnimal: animaisData.find(a => a.id_animal === Number(consultaOriginal.id_animal))?.nome || "Animal não encontrado",
        nomeFuncionario: funcionarioData.find(f => f.id_funcionario === Number(consultaOriginal.id_funcionario))?.nome || "Funcionário não encontrado"
      }));

      console.log('Consultas processadas:', consultasEnriquecidas); // Debug
      setConsultas(consultasEnriquecidas);
    } catch (err: any) {
      const errorMessage = err.message || "Ocorreu um erro ao carregar os dados do dashboard.";
      setError(errorMessage);
      console.error("Erro ao buscar dados para o dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const consultasFiltradas = useMemo(() => {
    if (!termoDeBusca.trim()) {
      return listaCompletaConsultas;
    }
    const termoLower = termoDeBusca.toLowerCase().trim();
    return listaCompletaConsultas.filter((consulta) => {
      const nomeFuncionarioLower =
        consulta.nomeFuncionario?.toLowerCase() || "";
      const idFuncionarioString = consulta.id_funcionario.toString();
      return (
        nomeFuncionarioLower.includes(termoLower) ||
        idFuncionarioString.includes(termoLower)
      );
    });
  }, [listaCompletaConsultas, termoDeBusca]);

  const consultasParaExibir = mostrarTodos
    ? consultasFiltradas
    : consultasFiltradas.slice(0, LIMITE_INICIAL_CONSULTAS);

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
          Consulta selecionada: Animal {consultaSelecionada.nomeAnimal} com
          Dr(a). {consultaSelecionada.nomeFuncionario}
        </div>
      )}

      <div className="funcoes-crud">
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar Consulta"
          title="Adicionar"
          description="Cadastrar nova consulta"
          onClick={() => handleAcaoCrud("adicionar")}
        />

        <BtnCrud
          imageUrl={editarIcon}
          imageAlt="Editar Consulta"
          title="Editar"
          description="Editar uma consulta"
          onClick={() => handleAcaoCrud("editar")}
          disabled={!consultaSelecionada}
        />

        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar Consulta"
          title="Apagar"
          description="Apagar uma consulta"
          onClick={() => handleAcaoCrud("apagar")}
          disabled={!consultaSelecionada}
        />

        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="Listar Consulta"
          title="Listar"
          description="Ver detalhes"
          onClick={() => handleAcaoCrud("listar")}
          disabled={!consultaSelecionada}
        />
      </div>

      <div className="lista-consultas">
        {consultas.length > 0 ? (
          consultas.map((consultaItem) => (
            <div
              key={
                consultaItem.id_consulta ||
                `${consultaItem.id_animal}-${consultaItem.data_hora}`
              }
              onClick={() => handleSelecionarConsulta(consultaItem)}
              className={`consulta-card ${
                consultaSelecionada?.id_consulta === consultaItem.id_consulta
                  ? "selecionado"
                  : ""
              }`}
            >
              <ConsultasHoje
                id_consulta={consultaItem.id_consulta}
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
                Ver mais ({consultasFiltradas.length - LIMITE_INICIAL_CONSULTAS}{" "}
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
        title="Adicionar Consulta"
      >
        <div className="form-group">
          <label className="required">Animal:</label>
          <select
            value={formData.id_animal}
            onChange={(e) => setFormData({ ...formData, id_animal: Number(e.target.value) })}
            required
          >
            <option value="">Selecione um animal</option>
            {animais && animais.map((animal) => (
              <option key={animal.id_animal} value={animal.id_animal}>
                {animal.nome || 'Nome não disponível'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="required">Veterinário:</label>
          <select
            value={formData.id_funcionario}
            onChange={(e) => setFormData({ ...formData, id_funcionario: Number(e.target.value) })}
            required
          >
            <option value="">Selecione um veterinário</option>
            {funcionarios && funcionarios.map((funcionario) => (
              <option key={funcionario.id_funcionario} value={funcionario.id_funcionario}>
                {funcionario.nome || 'Nome não disponível'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="required">Data e Hora:</label>
          <input
            type="datetime-local"
            value={formData.data_hora.toISOString().slice(0, 16)}
            onChange={(e) => setFormData({ ...formData, data_hora: new Date(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Status:</label>
          <select
            value={formData.status_consulta}
            onChange={(e) => setFormData({ ...formData, status_consulta: e.target.value as 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento' })}
            required
          >
            <option value="Agendada">Agendada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Remarcada">Remarcada</option>
            <option value="Não Compareceu">Não Compareceu</option>
            <option value="Em Andamento">Em Andamento</option>
          </select>
        </div>

        <div className="form-group">
          <label className="required">Preço:</label>
          <input
            type="number"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Diagnóstico:</label>
          <textarea
            value={formData.diagnostico || ''}
            onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value || null })}
            rows={4}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalAdicionar(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleAdicionarConsulta}>
            Adicionar
          </button>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar Consulta"
      >
        <div className="form-group">
          <label className="required">Animal:</label>
          <select
            value={formData.id_animal}
            onChange={(e) => setFormData({ ...formData, id_animal: Number(e.target.value) })}
            required
          >
            <option value="">Selecione um animal</option>
            {animais && animais.map((animal) => (
              <option key={animal.id_animal} value={animal.id_animal}>
                {animal.nomeAnimal || 'Nome não disponível'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="required">Veterinário:</label>
          <select
            value={formData.id_funcionario}
            onChange={(e) => setFormData({ ...formData, id_funcionario: Number(e.target.value) })}
            required
          >
            <option value="">Selecione um veterinário</option>
            {funcionarios && funcionarios.map((funcionario) => (
              <option key={funcionario.id_funcionario} value={funcionario.id_funcionario}>
                {funcionario.nome || 'Nome não disponível'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="required">Data e Hora:</label>
          <input
            type="datetime-local"
            value={formData.data_hora.toISOString().slice(0, 16)}
            onChange={(e) => setFormData({ ...formData, data_hora: new Date(e.target.value) })}
            required
          />
        </div>

        <div className="form-group">
          <label className="required">Status:</label>
          <select
            value={formData.status_consulta}
            onChange={(e) => setFormData({ ...formData, status_consulta: e.target.value as 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento' })}
            required
          >
            <option value="Agendada">Agendada</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Remarcada">Remarcada</option>
            <option value="Não Compareceu">Não Compareceu</option>
            <option value="Em Andamento">Em Andamento</option>
          </select>
        </div>

        <div className="form-group">
          <label className="required">Preço:</label>
          <input
            type="number"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Diagnóstico:</label>
          <textarea
            value={formData.diagnostico || ''}
            onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value || null })}
            rows={4}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleEditarConsulta}>
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
          Tem certeza que deseja apagar a consulta do animal{" "}
          <strong>{consultaSelecionada?.nomeAnimal}</strong> com o veterinário{" "}
          <strong>{consultaSelecionada?.nomeFuncionario}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalApagar(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleApagarConsulta}>
            Apagar
          </button>
        </div>
      </Modal>

      {/* Modal Detalhes */}
      <Modal
        isOpen={modalDetalhes}
        onClose={() => setModalDetalhes(false)}
        title="Detalhes da Consulta"
      >
        {consultaSelecionada && (
          <div>
            <p><strong>ID:</strong> {consultaSelecionada.id_consulta}</p>
            <p><strong>Animal:</strong> {consultaSelecionada.nomeAnimal}</p>
            <p><strong>Veterinário:</strong> {consultaSelecionada.nomeFuncionario}</p>
            <p><strong>Data e Hora:</strong> {new Date(consultaSelecionada.data_hora).toLocaleString('pt-BR')}</p>
            <p><strong>Status:</strong> {consultaSelecionada.status_consulta}</p>
            <p><strong>Preço:</strong> R$ {Number(consultaSelecionada.preco).toFixed(2)}</p>
            <p><strong>Diagnóstico:</strong> {consultaSelecionada.diagnostico || 'N/A'}</p>
            <p><strong>Criado em:</strong> {consultaSelecionada.createdAt ? new Date(consultaSelecionada.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <p><strong>Última atualização:</strong> {consultaSelecionada.updatedAt ? new Date(consultaSelecionada.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
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
