import React, { useEffect, useMemo, useState } from "react";
import type { Funcionario } from "../types/interfaces";
import Navbar from "../components/Navbar";
import ListarFuncionarios from "../components/Funcionarios/ListarFuncionarios";
import BtnCrud from '../components/ui/BtnCrud'
import Modal from '../components/ui/Modal'
import NomeTela from "../components/ui/NomeTela";
import lupaIcon from '../assets/icons/lupa.png'
import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import './Funcionario.css'
import { validateName, validatePhone, validateEmail, formatPhone } from '../utils/validation';
import type { FormErrors } from '../utils/validation';

interface FuncionarioForm {
  nome: string;
  cargo: string;
  telefone: string;
  email: string;
}

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

  // Estados para controle dos modais
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalApagar, setModalApagar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  
  // Estado para o formulário
  const [formData, setFormData] = useState<FuncionarioForm>({
    nome: '',
    cargo: '',
    telefone: '',
    email: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Carregar funcionários
  const carregarFuncionarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/api/funcionarios");
      if (!response.ok) {
        throw new Error(`Falha ao buscar funcionários: ${response.statusText}`);
      }
      const data = await response.json();
      setListaCompletaFuncionarios(data.map((func: any) => ({
        ...func,
        id_funcionario: Number(func.id_funcionario),
        createdAt: func.createdAt ? new Date(func.createdAt) : undefined,
        updatedAt: func.updatedAt ? new Date(func.updatedAt) : undefined,
      })));
    } catch (err: any) {
      setError(err.message || "Erro ao carregar funcionários");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const validateForm = () => {
    const errors: FormErrors = {};
    const nameError = validateName(formData.nome);
    const phoneError = validatePhone(formData.telefone);
    const emailError = validateEmail(formData.email);
    const cargoError = validateName(formData.cargo); // Usando a mesma validação de nome para cargo

    if (nameError) errors[nameError.field] = nameError.message;
    if (phoneError) errors[phoneError.field] = phoneError.message;
    if (emailError) errors[emailError.field] = emailError.message;
    if (cargoError) errors['cargo'] = cargoError.message;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Funções CRUD
  const handleAdicionarFuncionario = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/funcionarios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const novoFuncionario = await response.json();
        setListaCompletaFuncionarios([...listaCompletaFuncionarios, novoFuncionario]);
        setModalAdicionar(false);
        setFormData({
          nome: "",
          cargo: "",
          telefone: "",
          email: "",
        });
        setFormErrors({});
        alert('Funcionário adicionado com sucesso!');
      } else {
        throw new Error('Erro ao adicionar funcionário');
      }
    } catch (err: any) {
      console.error('Erro ao adicionar funcionário:', err);
      alert(err.message || 'Erro ao adicionar funcionário');
    }
  };

  const handleEditarFuncionario = async () => {
    if (!validateForm()) {
      return;
    }

    if (!funcionarioSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/funcionarios/${funcionarioSelecionado.id_funcionario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const funcionarioAtualizado = await response.json();
        setListaCompletaFuncionarios(listaCompletaFuncionarios.map(func => 
          func.id_funcionario === funcionarioSelecionado.id_funcionario ? funcionarioAtualizado : func
        ));
        setModalEditar(false);
        setFuncionarioSelecionado(null);
        setFormData({
          nome: "",
          cargo: "",
          telefone: "",
          email: "",
        });
        setFormErrors({});
        alert('Funcionário atualizado com sucesso!');
      } else {
        throw new Error('Erro ao atualizar funcionário');
      }
    } catch (err: any) {
      console.error('Erro ao editar funcionário:', err);
      alert(err.message || 'Erro ao editar funcionário');
    }
  };

  const handleApagarFuncionario = async () => {
    if (!funcionarioSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/funcionarios/${funcionarioSelecionado.id_funcionario}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        await carregarFuncionarios();
        setModalApagar(false);
        setFuncionarioSelecionado(null);
        alert('Funcionário removido com sucesso!');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao apagar funcionário');
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
        if (funcionarioSelecionado) {
          // Garantir que todos os campos tenham valores padrão apropriados
          const nome = funcionarioSelecionado.nome;
          const cargo = funcionarioSelecionado.cargo;
          const telefone = funcionarioSelecionado.telefone;
          const email = funcionarioSelecionado.email;

          setFormData({
            nome,
            cargo,
            telefone,
            email
          });
          setModalEditar(true);
        }
        break;
      case "apagar":
        if (funcionarioSelecionado) {
          setModalApagar(true);
        }
        break;
      case "listar":
        if (funcionarioSelecionado) {
          setModalDetalhes(true);
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
      <Navbar />
      <div className="nome-tela-container">
        <NomeTela message="Funcionários Cadastrados" />
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
          imageUrl={editarIcon}
          imageAlt="Editar Funcionário"
          title="Editar"
          description="Editar um funcionário"
          onClick={() => handleAcaoCrud("editar")}
          disabled={!funcionarioSelecionado}
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
          imageUrl={listarIcon}
          imageAlt="Listar Funcionário"
          title="Listar"
          description="Ver detalhes"
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

      {/* Modal Adicionar */}
      <Modal
        isOpen={modalAdicionar}
        onClose={() => {
          setModalAdicionar(false);
          setFormErrors({});
        }}
        title="Adicionar Funcionário"
      >
        <div className={`form-group ${formErrors.nome ? 'has-error' : ''}`}>
          <label className="required">Nome:</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => {
              setFormData({ ...formData, nome: e.target.value });
              if (formErrors.nome) {
                const { nome, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Nome completo"
          />
          {formErrors.nome && <div className="error-message">{formErrors.nome}</div>}
        </div>
        <div className={`form-group ${formErrors.cargo ? 'has-error' : ''}`}>
          <label className="required">Cargo:</label>
          <input
            type="text"
            value={formData.cargo}
            onChange={(e) => {
              setFormData({ ...formData, cargo: e.target.value });
              if (formErrors.cargo) {
                const { cargo, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Ex: Veterinário, Auxiliar, Recepcionista..."
          />
          {formErrors.cargo && <div className="error-message">{formErrors.cargo}</div>}
        </div>
        <div className={`form-group ${formErrors.telefone ? 'has-error' : ''}`}>
          <label className="required">Telefone:</label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setFormData({ ...formData, telefone: formatted });
              if (formErrors.telefone) {
                const { telefone, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="(00) 00000-0000"
          />
          {formErrors.telefone && <div className="error-message">{formErrors.telefone}</div>}
        </div>
        <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
          <label className="required">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (formErrors.email) {
                const { email, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="email@exemplo.com"
          />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setModalAdicionar(false);
              setFormErrors({});
            }}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleAdicionarFuncionario}>
            Adicionar
          </button>
        </div>
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={modalEditar}
        onClose={() => {
          setModalEditar(false);
          setFormErrors({});
        }}
        title="Editar Funcionário"
      >
        <div className={`form-group ${formErrors.nome ? 'has-error' : ''}`}>
          <label className="required">Nome:</label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => {
              setFormData({ ...formData, nome: e.target.value });
              if (formErrors.nome) {
                const { nome, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Nome completo"
          />
          {formErrors.nome && <div className="error-message">{formErrors.nome}</div>}
        </div>
        <div className={`form-group ${formErrors.cargo ? 'has-error' : ''}`}>
          <label className="required">Cargo:</label>
          <input
            type="text"
            value={formData.cargo}
            onChange={(e) => {
              setFormData({ ...formData, cargo: e.target.value });
              if (formErrors.cargo) {
                const { cargo, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Ex: Veterinário, Auxiliar, Recepcionista..."
          />
          {formErrors.cargo && <div className="error-message">{formErrors.cargo}</div>}
        </div>
        <div className={`form-group ${formErrors.telefone ? 'has-error' : ''}`}>
          <label className="required">Telefone:</label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setFormData({ ...formData, telefone: formatted });
              if (formErrors.telefone) {
                const { telefone, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="(00) 00000-0000"
          />
          {formErrors.telefone && <div className="error-message">{formErrors.telefone}</div>}
        </div>
        <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
          <label className="required">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (formErrors.email) {
                const { email, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="email@exemplo.com"
          />
          {formErrors.email && <div className="error-message">{formErrors.email}</div>}
        </div>
        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setModalEditar(false);
              setFormErrors({});
            }}
          >
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleEditarFuncionario}>
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
          Tem certeza que deseja apagar o funcionário{" "}
          <strong>{funcionarioSelecionado?.nome}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalApagar(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleApagarFuncionario}>
            Apagar
          </button>
        </div>
      </Modal>

      {/* Modal Detalhes */}
      <Modal
        isOpen={modalDetalhes}
        onClose={() => setModalDetalhes(false)}
        title="Detalhes do Funcionário"
      >
        {funcionarioSelecionado && (
          <div>
            <p><strong>ID:</strong> {funcionarioSelecionado.id_funcionario}</p>
            <p><strong>Nome:</strong> {funcionarioSelecionado.nome}</p>
            <p><strong>Cargo:</strong> {funcionarioSelecionado.cargo}</p>
            <p><strong>Telefone:</strong> {funcionarioSelecionado.telefone}</p>
            <p><strong>Email:</strong> {funcionarioSelecionado.email}</p>
            <p><strong>Criado em:</strong> {funcionarioSelecionado.createdAt ? new Date(funcionarioSelecionado.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <p><strong>Última atualização:</strong> {funcionarioSelecionado.updatedAt ? new Date(funcionarioSelecionado.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
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