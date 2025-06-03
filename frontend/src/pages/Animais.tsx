// src/pages/Animais.tsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import BtnCrud from "../components/ui/BtnCrud";
import Modal from "../components/ui/Modal";
import ListarAnimaisCard from "../components/Animais/listarAnimais";

// Ícones
import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import lupaIcon from "../assets/icons/lupa.png";

import "./Animais.css";
import type { Animal, Tutor } from "../types/interfaces";

interface AnimalForm {
  nomeAnimal: string;
  nomeTutor: string;
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
    nomeAnimal: "",
    nomeTutor: "",
    raca: "",
    peso: 0,
    observacoes_medicas: "",
    especie: "",
    sexo: "",
    data_nascimento: "",
    status_animal: "Ativo"
  });

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

      const mapaTutores = new Map(
        tutoresData.map((tutor) => [tutor.id_tutor, tutor.nome])
      );

      // Enriquecer animais
      const animaisEnriquecidos: Animal[] = animaisDataBruta.map((animalBruto) => ({
        id_animal: Number(animalBruto.id_animal),
        nomeAnimal: animalBruto.nome || '',
        especie: animalBruto.especie || '',
        raca: animalBruto.raca || '',
        peso: Number(animalBruto.peso) || 0,
        sexo: animalBruto.sexo || '',
        data_nascimento: animalBruto.data_nascimento ? new Date(animalBruto.data_nascimento) : undefined,
        observacoes_medicas: animalBruto.observacoes_medicas || null,
        status_animal: animalBruto.status_animal || 'Ativo',
        id_tutor: Number(animalBruto.id_tutor),
        createdAt: animalBruto.createdAt ? new Date(animalBruto.createdAt) : undefined,
        updatedAt: animalBruto.updatedAt ? new Date(animalBruto.updatedAt) : undefined,
        nomeTutor: mapaTutores.get(Number(animalBruto.id_tutor)) || "Tutor não encontrado",
      }));

      setListaCompletaAnimais(animaisEnriquecidos);
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

  // --- Lógica de Filtragem (Frontend) ---
  const animaisFiltrados = useMemo(() => {
    // Se não há termo de busca, retorna a lista completa
    if (!termoDeBusca.trim()) {
      return listaCompletaAnimais;
    }

    const termoLower = termoDeBusca.toLowerCase().trim();

    return listaCompletaAnimais.filter((animal) => {
      const nomeAnimalLower = animal.nomeAnimal?.toLowerCase() || "";
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

  // funçoes crud
  const handleAdicionarAnimal = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!formData.nomeAnimal || !formData.nomeTutor || !formData.raca) {
        alert('Por favor, preencha todos os campos obrigatórios: Nome do Animal, Nome do Tutor e Raça.');
        return;
      }

      // Primeiro, precisamos buscar o id_tutor baseado no nome do tutor
      const tutoresResponse = await fetch("http://localhost:3001/api/tutores");
      if (!tutoresResponse.ok) {
        throw new Error('Erro ao buscar tutores');
      }
      const tutores = await tutoresResponse.json();
      const tutor = tutores.find((t: any) => t.nome.toLowerCase() === formData.nomeTutor.toLowerCase());
      
      if (!tutor) {
        alert('Tutor não encontrado. Por favor, verifique o nome do tutor.');
        return;
      }

      // Preparar dados para envio
      const animalData = {
        nome: formData.nomeAnimal,
        raca: formData.raca,
        peso: formData.peso || 0,
        observacoes_medicas: formData.observacoes_medicas || null,
        status_animal: formData.status_animal,
        id_tutor: tutor.id_tutor,
        especie: formData.especie || null,
        sexo: formData.sexo || null,
        data_nascimento: formData.data_nascimento ? new Date(formData.data_nascimento) : null
      };

      // Enviar para a API
      const response = await fetch("http://localhost:3001/api/animais", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar animal');
      }

      await fetchDadosIniciais();
      setModalAdicionar(false);
      setFormData({
        nomeAnimal: "",
        nomeTutor: "",
        raca: "",
        peso: 0,
        observacoes_medicas: "",
        especie: "",
        sexo: "",
        data_nascimento: "",
        status_animal: "Ativo"
      });
      alert('Animal adicionado com sucesso!');
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const handleEditarAnimal = async () => {
    if (!animalSelecionado) return;

    try {
      // Preparar dados para envio
      const animalData = {
        nome: formData.nomeAnimal,
        raca: formData.raca,
        peso: formData.peso || 0,
        observacoes_medicas: formData.observacoes_medicas || null,
        status_animal: formData.status_animal,
        especie: formData.especie || null,
        sexo: formData.sexo || null,
        data_nascimento: formData.data_nascimento ? new Date(formData.data_nascimento) : null
      };

      const response = await fetch(`http://localhost:3001/api/animais/${animalSelecionado.id_animal}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao editar animal');
      }

      await fetchDadosIniciais();
      setModalEditar(false);
      setAnimalSelecionado(null);
      alert('Animal atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro:', err);
      alert(err.message);
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
          const nomeAnimal = animalSelecionado.nomeAnimal ?? "";
          const nomeTutor = animalSelecionado.nomeTutor ?? "";
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
            nomeAnimal,
            nomeTutor,
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
          Animal selecionado: {animalSelecionado.nomeAnimal} (ID:{" "}
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
        onClose={() => setModalAdicionar(false)}
        title="Adicionar Animal"
      >
        <div className="form-group">
          <label>Nome do Animal:</label>
          <input
            type="text"
            value={formData.nomeAnimal}
            onChange={(e) => setFormData({ ...formData, nomeAnimal: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Nome do Tutor:</label>
          <input
            type="text"
            value={formData.nomeTutor}
            onChange={(e) => setFormData({ ...formData, nomeTutor: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Espécie:</label>
          <input
            type="text"
            value={formData.especie}
            onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Raça:</label>
          <input
            type="text"
            value={formData.raca}
            onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Peso (kg):</label>
          <input
            type="number"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Sexo:</label>
          <select
            value={formData.sexo}
            onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>
        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            value={formData.status_animal}
            onChange={(e) => setFormData({ ...formData, status_animal: e.target.value as "Ativo" | "Inativo" | "Falecido" })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Falecido">Falecido</option>
          </select>
        </div>
        <div className="form-group">
          <label>Observações Médicas:</label>
          <textarea
            value={formData.observacoes_medicas}
            onChange={(e) => setFormData({ ...formData, observacoes_medicas: e.target.value })}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalAdicionar(false)}>
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
        onClose={() => setModalEditar(false)}
        title="Editar Animal"
      >
        <div className="form-group">
          <label>Nome do Animal:</label>
          <input
            type="text"
            value={formData.nomeAnimal}
            onChange={(e) => setFormData({ ...formData, nomeAnimal: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Nome do Tutor:</label>
          <input
            type="text"
            value={formData.nomeTutor}
            onChange={(e) => setFormData({ ...formData, nomeTutor: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Espécie:</label>
          <input
            type="text"
            value={formData.especie}
            onChange={(e) => setFormData({ ...formData, especie: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Raça:</label>
          <input
            type="text"
            value={formData.raca}
            onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Peso (kg):</label>
          <input
            type="number"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Sexo:</label>
          <select
            value={formData.sexo}
            onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="Macho">Macho</option>
            <option value="Fêmea">Fêmea</option>
          </select>
        </div>
        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select
            value={formData.status_animal}
            onChange={(e) => setFormData({ ...formData, status_animal: e.target.value as "Ativo" | "Inativo" | "Falecido" })}
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Falecido">Falecido</option>
          </select>
        </div>
        <div className="form-group">
          <label>Observações Médicas:</label>
          <textarea
            value={formData.observacoes_medicas}
            onChange={(e) => setFormData({ ...formData, observacoes_medicas: e.target.value })}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setModalEditar(false)}>
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
          <strong>{animalSelecionado?.nomeAnimal}</strong>?
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
            <p><strong>Nome:</strong> {animalSelecionado.nomeAnimal}</p>
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
