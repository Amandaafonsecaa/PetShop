// src/pages/Animais.tsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import NomeTela from "../components/ui/NomeTela";
import BtnCrud from "../components/ui/BtnCrud";
import ListarAnimaisCard from "../components/Animais/listarAnimais";

// Ícones
import adicionarIcon from "../assets/icons/adicionar.png";
import apagarIcon from "../assets/icons/apagar.png";
import editarIcon from "../assets/icons/editar.png";
import listarIcon from "../assets/icons/ver.png";
import lupaIcon from "../assets/icons/lupa.png";

import "./Animais.css";
import type { Animal, Tutor } from "../types/interfaces";

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
  const LIMITE_INICIAL_ANIMAIS = 7;

  useEffect(() => {
    const fetchDadosIniciais = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Animais
        const animaisResponse = await fetch(
          "http://localhost:3001/api/animais"
        );
        if (!animaisResponse.ok)
          throw new Error(
            `Falha ao buscar animais: ${animaisResponse.statusText}`
          );
        const animaisDataBruta: any[] = await animaisResponse.json();
        console.log("1. Animais Brutos da API:", animaisDataBruta);

        // Fetch Tutores
        const tutoresResponse = await fetch(
          "http://localhost:3001/api/tutores"
        );
        if (!tutoresResponse.ok)
          throw new Error(
            `Falha ao buscar tutores: ${tutoresResponse.statusText}`
          );
        const tutoresData: Tutor[] = await tutoresResponse.json();
        console.log("2. Tutores da API:", tutoresData);

        const mapaTutores = new Map(
          tutoresData.map((tutor) => [tutor.id_tutor, tutor.nome])
        );
        console.log(
          "3. Mapa de Tutores Criado:",
          Array.from(mapaTutores.entries())
        );

        // Enriquecer animais
        const animaisEnriquecidos: Animal[] = animaisDataBruta.map(
          (animalBruto) => {
            // Certifique-se que sua interface Animal tenha 'nomeAnimal'
            // e que os tipos de 'peso' e 'data_nascimento' sejam tratados
            return {
              id_animal: Number(animalBruto.id_animal),
              nomeAnimal: animalBruto.nome, // Mapeando 'nome' do backend para 'nomeAnimal'
              especie: animalBruto.especie,
              raca: animalBruto.raca,
              peso: parseFloat(animalBruto.peso), // Convertendo string para número
              sexo: animalBruto.sexo,
              data_nascimento: new Date(animalBruto.data_nascimento), // Convertendo string para Date
              observacoes_medicas: animalBruto.observacoes_medicas,
              status_animal: animalBruto.status_animal,
              id_tutor: Number(animalBruto.id_tutor),
              createdAt: animalBruto.createdAt
                ? new Date(animalBruto.createdAt)
                : undefined,
              updatedAt: animalBruto.updatedAt
                ? new Date(animalBruto.updatedAt)
                : undefined,
              nomeTutor:
                mapaTutores.get(Number(animalBruto.id_tutor)) ||
                "Tutor não encontrado",
            };
          }
        );

        console.log("4. Animais Enriquecidos:", animaisEnriquecidos);
        setListaCompletaAnimais(animaisEnriquecidos);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao carregar os dados.");
        console.error("Erro ao buscar dados iniciais:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDadosIniciais();
  }, []); // Array de dependências vazio para rodar apenas na montagem

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

    
      <div
        className="funcoes-crud-animais"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "20px",
        }}
      >
        <BtnCrud
          imageUrl={adicionarIcon}
          imageAlt="Adicionar Animal"
          title="Adicionar"
          description="Cadastrar novo animal"
        />

        <BtnCrud
          imageUrl={apagarIcon}
          imageAlt="Apagar Animal"
          title="Apagar"
          description="Apagar um animal"
        /><BtnCrud
          imageUrl={editarIcon}
          imageAlt="Editar Animal"
          title="Editar"
          description="Editar um animal"
        />
        <BtnCrud
          imageUrl={listarIcon}
          imageAlt="listar Animal"
          title="Listar"
          description="Listar animais"
        />
       
      </div>

      
      <div className="lista-animais-container">
        {animaisParaExibir.length > 0 ? (
          animaisParaExibir.map((animal) => (
            <ListarAnimaisCard
              key={animal.id_animal}
              {...animal} // Passa todas as propriedades do objeto animal enriquecido
            />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            
            {termoDeBusca.trim() && listaCompletaAnimais.length > 0
              ? "Nenhum animal encontrado com este nome ou ID."
              : "Nenhum animal cadastrado."}
          </p>
        )}

        {/* Botões "Ver mais" / "Ver menos" */}
        {/* Só mostra os botões se a lista filtrada completa for maior que o limite */}
        {animaisFiltrados.length > LIMITE_INICIAL_ANIMAIS && (
          <div
            className="botoes-paginacao-animais"
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
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
    </div>
  );
}
