// src/pages/Animais.tsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import BtnCrud from "../components/ui/BtnCrud";
import Modal from "../components/ui/Modal";
import ListarAnimaisCard from "../components/Animais/listarAnimais";
import { validateName, validateNumber, validateDate } from '../utils/validation';
import type { FormErrors } from '../utils/validation';

// Ícones
import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import lupaIcon from "../assets/icons/lupa.png";

import "./Animais.css";
import type { Animal, Tutor } from "../types/interfaces";

// Dados mockados para quando o backend estiver indisponível
const MOCK_TUTORES: Tutor[] = [
  {
    id_tutor: 1,
    nome: "Carlos Silva",
    telefone: "(85) 98888-0001",
    email: "carlos@exemplo.com",
  },
  {
    id_tutor: 2,
    nome: "Mariana Souza",
    telefone: "(85) 97777-0002",
    email: "mariana@exemplo.com",
  },
];

const MOCK_ANIMAIS: Animal[] = [
  {
    id_animal: 1,
    nome: "Rex",
    especie: "Cão",
    raca: "Vira-lata",
    peso: 12,
    sexo: "Macho",
    data_nascimento: new Date(),
    id_tutor: 1,
    observacoes_medicas: "Vacinado e saudável",
    status_animal: "Ativo",
    createdAt: new Date(),
    updatedAt: new Date(),
    nomeTutor: "Carlos Silva",
  },
  {
    id_animal: 2,
    nome: "Mimi",
    especie: "Gato",
    raca: "Siamês",
    peso: 4,
    sexo: "Fêmea",
    data_nascimento: new Date(),
    id_tutor: 2,
    observacoes_medicas: "Alergia a ração X",
    status_animal: "Ativo",
    createdAt: new Date(),
    updatedAt: new Date(),
    nomeTutor: "Mariana Souza",
  },
];

interface AnimalForm {
  nome: string;
  id_tutor: number;
  raca: string;
  peso: number;
  observacoes_medicas: string;
  especie: string;
  sexo: string;
  data_nascimento: string;
  status_animal: "Ativo" | "Inativo" | "Falecido";
}

export default function Animais() {
  // Estado para TODOS os animais carregados e enriquecidos do backend
  const [listaCompletaAnimais, setListaCompletaAnimais] = useState<Animal[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para o termo de pesquisa digitado pelo usuário
  const [termoDeBusca, setTermoDeBusca] = useState<string>("");

  // Estados para a funcionalidade "Ver mais / Ver menos"
  const [mostrarTodos, setMostrarTodos] = useState<boolean>(false);
  const LIMITE_INICIAL_ANIMAIS = 3;

  // Estado para controlar o animal selecionado
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(
    null
  );

  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalApagar, setModalApagar] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(false);

  const [formData, setFormData] = useState<AnimalForm>({
    nome: "",
    id_tutor: 0,
    raca: "",
    peso: 0,
    observacoes_medicas: "",
    especie: "",
    sexo: "",
    data_nascimento: "",
    status_animal: "Ativo"
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [tutores, setTutores] = useState<Tutor[]>([]);

  const fetchDadosIniciais = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Animais
      const animaisResponse = await fetch("http://localhost:3001/api/animais");
      if (!animaisResponse.ok)
        throw new Error(`Falha ao buscar animais: ${animaisResponse.statusText}`);
      const animaisDataBruta: any[] = await animaisResponse.json();

      // Fetch Tutores
      const tutoresResponse = await fetch("http://localhost:3001/api/tutores");
      if (!tutoresResponse.ok)
        throw new Error(`Falha ao buscar tutores: ${tutoresResponse.statusText}`);
      const tutoresData: Tutor[] = await tutoresResponse.json();
      setTutores(tutoresData);

      const mapaTutores = new Map(
        tutoresData.map((tutor) => [tutor.id_tutor, tutor.nome])
      );

      // Enriquecer animais
      const animaisEnriquecidos: Animal[] = animaisDataBruta.map((animalBruto) => ({
        id_animal: Number(animalBruto.id_animal),
        nome: animalBruto.nome || '',
        especie: animalBruto.especie || '',
        raca: animalBruto.raca || '',
        peso: Number(animalBruto.peso) || 0,
        sexo: animalBruto.sexo || '',
        data_nascimento: animalBruto.data_nascimento ? new Date(animalBruto.data_nascimento) : new Date(),
        observacoes_medicas: animalBruto.observacoes_medicas || null,
        status_animal: animalBruto.status_animal || 'Ativo',
        id_tutor: Number(animalBruto.id_tutor),
        createdAt: animalBruto.createdAt ? new Date(animalBruto.createdAt) : undefined,
        updatedAt: animalBruto.updatedAt ? new Date(animalBruto.updatedAt) : undefined,
        nomeTutor: mapaTutores.get(Number(animalBruto.id_tutor)) || "Tutor não informado",
      }));

      setListaCompletaAnimais(animaisEnriquecidos);
    } catch (err: any) {
      console.error("Erro ao buscar dados iniciais:", err);
      // Backend indisponível: usar dados mockados
      console.warn("Backend indisponível. Usando dados mockados para animais e tutores.");
      setTutores(MOCK_TUTORES);
      setListaCompletaAnimais(MOCK_ANIMAIS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  // --- Lógica de Filtragem (Frontend) ---
  const animaisFiltrados = useMemo(() => {
    // Se não há termo de busca, retorna a lista completa
    if (!termoDeBusca.trim()) {
      return listaCompletaAnimais;
    }

    const termoLower = termoDeBusca.toLowerCase().trim();

    return listaCompletaAnimais.filter((animal) => {
      const nomeAnimalLower = animal.nome?.toLowerCase() || "";
      // 'id_animal' é um número na interface, então convertemos para string para a busca
      const idAnimalString = animal.id_animal.toString();

      // Verifica se o nome OU o ID contêm o termo de busca
      return (
        nomeAnimalLower.includes(termoLower) ||
        idAnimalString.includes(termoLower)
      );
    });
  }, [listaCompletaAnimais, termoDeBusca]); // Recalcula quando a lista ou o termo mudam

  // --- Lógica de Paginação ("Ver mais/Ver menos") ---
  // Aplica a paginação sobre a lista JÁ FILTRADA
  const animaisParaExibir = mostrarTodos
    ? animaisFiltrados
    : animaisFiltrados.slice(0, LIMITE_INICIAL_ANIMAIS);

  // Função para lidar com a seleção de um animal
  const handleSelecionarAnimal = (animal: Animal) => {
    if (animalSelecionado?.id_animal === animal.id_animal) {
      setAnimalSelecionado(null); // Desseleciona se clicar no mesmo animal
    } else {
      setAnimalSelecionado(animal); // Seleciona o novo animal
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    const nomeError = validateName(formData.nome);
    const especieError = validateName(formData.especie);
    const racaError = validateName(formData.raca);
    const pesoError = validateNumber(formData.peso, 'peso');
    const dataError = validateDate(formData.data_nascimento);

    if (nomeError) errors['nome'] = nomeError.message;
    if (especieError) errors['especie'] = especieError.message;
    if (racaError) errors['raca'] = racaError.message;
    if (pesoError) errors[pesoError.field] = pesoError.message;
    if (dataError) errors['data_nascimento'] = dataError.message;
    if (!formData.id_tutor) errors['id_tutor'] = 'ID do tutor é obrigatório';
    if (!formData.sexo) errors['sexo'] = 'Sexo é obrigatório';
    if (!formData.status_animal) errors['status_animal'] = 'Status é obrigatório';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdicionarAnimal = async () => {
    if (!validateForm()) {
        return;
      }

    try {
      const response = await fetch("http://localhost:3001/api/animais", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          id_tutor: formData.id_tutor,
          especie: formData.especie,
          raca: formData.raca,
          peso: formData.peso,
          sexo: formData.sexo,
          data_nascimento: formData.data_nascimento,
          observacoes_medicas: formData.observacoes_medicas,
          status_animal: formData.status_animal
        }),
      });

      if (response.ok) {
        const novoAnimal = await response.json();
        setListaCompletaAnimais([...listaCompletaAnimais, novoAnimal]);
      setModalAdicionar(false);
      setFormData({
          nome: "",
          id_tutor: 0,
        raca: "",
        peso: 0,
        observacoes_medicas: "",
        especie: "",
        sexo: "",
        data_nascimento: "",
        status_animal: "Ativo"
      });
        setFormErrors({});
      alert('Animal adicionado com sucesso!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar animal');
      }
    } catch (err: any) {
      console.error('Erro ao adicionar animal:', err);
      alert(err.message || 'Erro ao adicionar animal');
    }
  };

  const handleEditarAnimal = async () => {
    if (!validateForm()) {
      return;
    }

    if (!animalSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/animais/${animalSelecionado.id_animal}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const animalAtualizado = await response.json();
        setListaCompletaAnimais(listaCompletaAnimais.map(animal => 
          animal.id_animal === animalSelecionado.id_animal ? animalAtualizado : animal
        ));
      setModalEditar(false);
      setAnimalSelecionado(null);
        setFormData({
          nome: "",
          id_tutor: 0,
          raca: "",
          peso: 0,
          observacoes_medicas: "",
          especie: "",
          sexo: "",
          data_nascimento: "",
          status_animal: "Ativo"
        });
        setFormErrors({});
      alert('Animal atualizado com sucesso!');
      } else {
        throw new Error('Erro ao atualizar animal');
      }
    } catch (err: any) {
      console.error('Erro ao editar animal:', err);
      alert(err.message || 'Erro ao editar animal');
    }
  };

  const handleApagarAnimal = async () => {
    if (!animalSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3001/api/animais/${animalSelecionado.id_animal}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        await fetchDadosIniciais();
        setModalApagar(false);
        setAnimalSelecionado(null);
        alert('Animal removido com sucesso!');
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao apagar animal');
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
        if (animalSelecionado) {
          // Garantir que todos os campos tenham valores padrão apropriados
          const nome = animalSelecionado.nome ?? "";
          const id_tutor = animalSelecionado.id_tutor;
          const raca = animalSelecionado.raca ?? "";
          const peso = animalSelecionado.peso ?? 0;
          const observacoes_medicas = animalSelecionado.observacoes_medicas ?? "";
          const especie = animalSelecionado.especie ?? "";
          const sexo = animalSelecionado.sexo ?? "";
          const data_nascimento = animalSelecionado.data_nascimento 
            ? new Date(animalSelecionado.data_nascimento).toISOString().split('T')[0]
            : "";
          const status_animal = animalSelecionado.status_animal ?? "Ativo";

          setFormData({
            nome,
            id_tutor,
            raca,
            peso,
            observacoes_medicas,
            especie,
            sexo,
            data_nascimento,
            status_animal
          });
          setModalEditar(true);
        }
        break;
      case "apagar":
        if (animalSelecionado) {
          setModalApagar(true);
        }
        break;
      case "listar":
        if (animalSelecionado) {
          setModalDetalhes(true);
        }
        break;
      default:
        break;
    }
  };

  // --- Renderização de Loading e Error ---
  if (loading) {
    return (
      <div className="animais-pagina">
        <Navbar /> <NomeTela message="Animais" />
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Carregando animais...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="animais-pagina">
        <Navbar /> <NomeTela message="Animais" />
        <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          Erro ao carregar animais: {error}
        </p>
      </div>
    );
  }

  // --- JSX Principal ---
  return (
    <div className="animais-pagina">
      <Navbar />
      <div className="nome-tela-container">
        <NomeTela message="Animais Cadastrados" />
      </div>

      {/* Campo de Pesquisa (Lupa) */}
      <div className="barra-pesquisa-container">
        <img src={lupaIcon} alt="Lupa" className="icone-lupa" />
        <input
          type="text"
          placeholder="Pesquisar por ID ou Nome do animal..."
          className="input-pesquisa-animais"
          value={termoDeBusca}
          onChange={(e) => {
            setTermoDeBusca(e.target.value);
            setMostrarTodos(false);
          }}
        />
      </div>

      {/* Status de seleção */}
      {animalSelecionado && (
        <div className="status-selecao">
          Animal selecionado: {animalSelecionado.nome} (ID:{" "}
          {animalSelecionado.id_animal})
        </div>
      )}

      <div className="funcoes-crud-animais">
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar Animal"
          title="Adicionar"
          description="Cadastrar novo animal"
          onClick={() => handleAcaoCrud("adicionar")}
        />

        <BtnCrud
          imageUrl={editarIcon}
          imageAlt="Editar Animal"
          title="Editar"
          description="Editar um animal"
          onClick={() => handleAcaoCrud("editar")}
          disabled={!animalSelecionado}
        />
        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar Animal"
          title="Apagar"
          description="Apagar um animal"
          onClick={() => handleAcaoCrud("apagar")}
          disabled={!animalSelecionado}
        />
        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="Listar Animal"
          title="Listar"
          description="Ver detalhes"
          onClick={() => handleAcaoCrud("listar")}
          disabled={!animalSelecionado}
        />
      </div>

      <div className="lista-animais-container">
        {animaisParaExibir.length > 0 ? (
          animaisParaExibir.map((animal) => (
            <div
              key={animal.id_animal}
              onClick={() => handleSelecionarAnimal(animal)}
              className={`animal-card ${
                animalSelecionado?.id_animal === animal.id_animal
                  ? "selecionado"
                  : ""
              }`}
            >
              <ListarAnimaisCard {...animal} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            {termoDeBusca.trim() && listaCompletaAnimais.length > 0
              ? "Nenhum animal encontrado com este nome ou ID."
              : "Nenhum animal cadastrado."}
          </p>
        )}

        {/* Botões "Ver mais" / "Ver menos" */}
        {animaisFiltrados.length > LIMITE_INICIAL_ANIMAIS && (
          <div className="botoes-paginacao-animais">
            {!mostrarTodos ? (
              <button
                onClick={() => setMostrarTodos(true)}
                className="btn-ver-mais"
              >
                Ver mais ({animaisFiltrados.length - LIMITE_INICIAL_ANIMAIS}{" "}
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
        title="Adicionar Animal"
      >
        <div className={`form-group ${formErrors.nome ? 'has-error' : ''}`}>
          <label className="required">Nome do Animal:</label>
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
            placeholder="Nome do animal"
          />
          {formErrors.nome && <div className="error-message">{formErrors.nome}</div>}
        </div>
        <div className={`form-group ${formErrors.id_tutor ? 'has-error' : ''}`}>
          <label className="required">Tutor:</label>
          <select
            value={formData.id_tutor}
            onChange={(e) => {
              setFormData({ ...formData, id_tutor: Number(e.target.value) });
              if (formErrors.id_tutor) {
                const { id_tutor, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
          >
            <option value="">Selecione um tutor</option>
            {tutores.map((tutor) => (
              <option key={tutor.id_tutor} value={tutor.id_tutor}>
                {tutor.nome}
              </option>
            ))}
          </select>
          {formErrors.id_tutor && <div className="error-message">{formErrors.id_tutor}</div>}
        </div>
        <div className={`form-group ${formErrors.especie ? 'has-error' : ''}`}>
          <label className="required">Espécie:</label>
          <input
            type="text"
            value={formData.especie}
            onChange={(e) => {
              setFormData({ ...formData, especie: e.target.value });
              if (formErrors.especie) {
                const { especie, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Ex: Cachorro, Gato, etc."
          />
          {formErrors.especie && <div className="error-message">{formErrors.especie}</div>}
        </div>
        <div className={`form-group ${formErrors.raca ? 'has-error' : ''}`}>
          <label className="required">Raça:</label>
          <input
            type="text"
            value={formData.raca}
            onChange={(e) => {
              setFormData({ ...formData, raca: e.target.value });
              if (formErrors.raca) {
                const { raca, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Raça do animal"
          />
          {formErrors.raca && <div className="error-message">{formErrors.raca}</div>}
        </div>
        <div className={`form-group ${formErrors.peso ? 'has-error' : ''}`}>
          <label className="required">Peso (kg):</label>
          <input
            type="number"
            value={formData.peso}
            onChange={(e) => {
              setFormData({ ...formData, peso: Number(e.target.value) });
              if (formErrors.peso) {
                const { peso, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            step="0.1"
            min="0"
          />
          {formErrors.peso && <div className="error-message">{formErrors.peso}</div>}
        </div>
        <div className={`form-group ${formErrors.sexo ? 'has-error' : ''}`}>
          <label className="required">Sexo:</label>
          <select
            value={formData.sexo}
            onChange={(e) => {
              setFormData({ ...formData, sexo: e.target.value });
              if (formErrors.sexo) {
                const { sexo, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
          >
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
          {formErrors.sexo && <div className="error-message">{formErrors.sexo}</div>}
        </div>
        <div className={`form-group ${formErrors.data_nascimento ? 'has-error' : ''}`}>
          <label className="required">Data de Nascimento:</label>
          <input
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => {
              setFormData({ ...formData, data_nascimento: e.target.value });
              if (formErrors.data_nascimento) {
                const { data_nascimento, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            max={new Date().toISOString().split('T')[0]}
          />
          {formErrors.data_nascimento && <div className="error-message">{formErrors.data_nascimento}</div>}
        </div>
        <div className={`form-group ${formErrors.status_animal ? 'has-error' : ''}`}>
          <label className="required">Status:</label>
          <select
            value={formData.status_animal}
            onChange={(e) => {
              setFormData({ ...formData, status_animal: e.target.value as "Ativo" | "Inativo" | "Falecido" });
              if (formErrors.status_animal) {
                const { status_animal, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Falecido">Falecido</option>
          </select>
          {formErrors.status_animal && <div className="error-message">{formErrors.status_animal}</div>}
        </div>
        <div className="form-group">
          <label>Observações Médicas:</label>
          <textarea
            value={formData.observacoes_medicas}
            onChange={(e) => setFormData({ ...formData, observacoes_medicas: e.target.value })}
            rows={4}
          />
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
          <button className="btn btn-primary" onClick={handleAdicionarAnimal}>
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
        title="Editar Animal"
      >
        <div className={`form-group ${formErrors.nome ? 'has-error' : ''}`}>
          <label className="required">Nome do Animal:</label>
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
            placeholder="Nome do animal"
          />
          {formErrors.nome && <div className="error-message">{formErrors.nome}</div>}
        </div>
        <div className={`form-group ${formErrors.id_tutor ? 'has-error' : ''}`}>
          <label className="required">ID do Tutor:</label>
          <input
            type="number"
            value={formData.id_tutor}
            onChange={(e) => {
              setFormData({ ...formData, id_tutor: Number(e.target.value) });
              if (formErrors.id_tutor) {
                const { id_tutor, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="ID do tutor"
          />
          {formErrors.id_tutor && <div className="error-message">{formErrors.id_tutor}</div>}
        </div>
        <div className={`form-group ${formErrors.especie ? 'has-error' : ''}`}>
          <label className="required">Espécie:</label>
          <input
            type="text"
            value={formData.especie}
            onChange={(e) => {
              setFormData({ ...formData, especie: e.target.value });
              if (formErrors.especie) {
                const { especie, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Ex: Cachorro, Gato, etc."
          />
          {formErrors.especie && <div className="error-message">{formErrors.especie}</div>}
        </div>
        <div className={`form-group ${formErrors.raca ? 'has-error' : ''}`}>
          <label className="required">Raça:</label>
          <input
            type="text"
            value={formData.raca}
            onChange={(e) => {
              setFormData({ ...formData, raca: e.target.value });
              if (formErrors.raca) {
                const { raca, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            placeholder="Raça do animal"
          />
          {formErrors.raca && <div className="error-message">{formErrors.raca}</div>}
        </div>
        <div className={`form-group ${formErrors.peso ? 'has-error' : ''}`}>
          <label className="required">Peso (kg):</label>
          <input
            type="number"
            value={formData.peso}
            onChange={(e) => {
              setFormData({ ...formData, peso: Number(e.target.value) });
              if (formErrors.peso) {
                const { peso, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            step="0.1"
            min="0"
          />
          {formErrors.peso && <div className="error-message">{formErrors.peso}</div>}
        </div>
        <div className={`form-group ${formErrors.sexo ? 'has-error' : ''}`}>
          <label className="required">Sexo:</label>
          <select
            value={formData.sexo}
            onChange={(e) => {
              setFormData({ ...formData, sexo: e.target.value });
              if (formErrors.sexo) {
                const { sexo, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
          >
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
          {formErrors.sexo && <div className="error-message">{formErrors.sexo}</div>}
        </div>
        <div className={`form-group ${formErrors.data_nascimento ? 'has-error' : ''}`}>
          <label className="required">Data de Nascimento:</label>
          <input
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => {
              setFormData({ ...formData, data_nascimento: e.target.value });
              if (formErrors.data_nascimento) {
                const { data_nascimento, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
            max={new Date().toISOString().split('T')[0]}
          />
          {formErrors.data_nascimento && <div className="error-message">{formErrors.data_nascimento}</div>}
        </div>
        <div className={`form-group ${formErrors.status_animal ? 'has-error' : ''}`}>
          <label className="required">Status:</label>
          <select
            value={formData.status_animal}
            onChange={(e) => {
              setFormData({ ...formData, status_animal: e.target.value as "Ativo" | "Inativo" | "Falecido" });
              if (formErrors.status_animal) {
                const { status_animal, ...rest } = formErrors;
                setFormErrors(rest);
              }
            }}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Falecido">Falecido</option>
          </select>
          {formErrors.status_animal && <div className="error-message">{formErrors.status_animal}</div>}
        </div>
        <div className="form-group">
          <label>Observações Médicas:</label>
          <textarea
            value={formData.observacoes_medicas}
            onChange={(e) => setFormData({ ...formData, observacoes_medicas: e.target.value })}
            rows={4}
          />
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
          <button className="btn btn-primary" onClick={handleEditarAnimal}>
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
          Tem certeza que deseja apagar o animal{" "}
          <strong>{animalSelecionado?.nome}</strong>?
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalApagar(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleApagarAnimal}>
            Apagar
          </button>
        </div>
      </Modal>

      {/* Modal Detalhes */}
      <Modal
        isOpen={modalDetalhes}
        onClose={() => setModalDetalhes(false)}
        title="Detalhes do Animal"
      >
        {animalSelecionado && (
          <div>
            <p><strong>ID:</strong> {animalSelecionado.id_animal}</p>
            <p><strong>Nome:</strong> {animalSelecionado.nome}</p>
            <p><strong>Tutor:</strong> {animalSelecionado.nomeTutor}</p>
            <p><strong>Raça:</strong> {animalSelecionado.raca}</p>
            <p><strong>Peso:</strong> {animalSelecionado.peso} kg</p>
            <p><strong>Espécie:</strong> {animalSelecionado.especie || 'N/A'}</p>
            <p><strong>Sexo:</strong> {animalSelecionado.sexo || 'N/A'}</p>
            <p><strong>Data de Nascimento:</strong> {animalSelecionado.data_nascimento ? new Date(animalSelecionado.data_nascimento).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <p><strong>Observações Médicas:</strong> {animalSelecionado.observacoes_medicas || 'N/A'}</p>
            <p><strong>Status:</strong> {animalSelecionado.status_animal}</p>
            <p><strong>Criado em:</strong> {animalSelecionado.createdAt ? new Date(animalSelecionado.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <p><strong>Última atualização:</strong> {animalSelecionado.updatedAt ? new Date(animalSelecionado.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
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
