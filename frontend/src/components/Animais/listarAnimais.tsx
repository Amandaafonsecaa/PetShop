import React, { useEffect, useState } from 'react';
import type { Animal, Tutor } from '../../types/interfaces';
import "./listarAnimais.css";

const ListarAnimaisCard: React.FC<Animal> = ({
  id_animal,
  nome,
  especie,
  raca,
  peso,
  sexo,
  data_nascimento,
  id_tutor,
  observacoes_medicas,
  status_animal,
  createdAt,
  updatedAt
}) => {
  const [nomeTutor, setNomeTutor] = useState<string>('Carregando...');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tutores/${id_tutor}`);
        if (response.ok) {
          const tutor: Tutor = await response.json();
          setNomeTutor(tutor.nome);
        } else {
          setNomeTutor('Tutor não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar tutor:', error);
        setNomeTutor('Erro ao carregar tutor');
      }
    };

    fetchTutor();
  }, [id_tutor]);

  const formatarData = (data: Date | undefined) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="animal-card-content">
      <div className="animal-info">
        <div className="animal-header">
          <h3>{nome}</h3>
          <span 
            className={`status-badge ${status_animal.toLowerCase()}`}
          >
            {status_animal}
          </span>
        </div>
        <p><strong>ID:</strong> {id_animal}</p>
        <p><strong>Tutor:</strong> {nomeTutor}</p>
        <p><strong>Espécie:</strong> {especie || 'N/A'}</p>
        <p><strong>Raça:</strong> {raca}</p>
        <p><strong>Peso:</strong> {peso} kg</p>
        <p><strong>Sexo:</strong> {sexo || 'N/A'}</p>
        <p><strong>Data de Nascimento:</strong> {formatarData(data_nascimento)}</p>
        {observacoes_medicas && (
          <p><strong>Observações Médicas:</strong> {observacoes_medicas}</p>
        )}
        <p><strong>Criado em:</strong> {formatarData(createdAt)}</p>
        <p><strong>Atualizado em:</strong> {formatarData(updatedAt)}</p>
      </div>
    </div>
  );
};

export default ListarAnimaisCard;
