import React, { useEffect, useState } from 'react';
import type { Animal, Tutor } from '../../types/interfaces';
import "./listarAnimais.css";

const ListarAnimaisCard: React.FC<Animal> = ({
  nome,
  especie,
  raca,
  id_tutor,
  status_animal,
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

  const getStatusColor = () => {
    switch (status_animal.toLowerCase()) {
      case 'ativo':
        return 'status-ativo';
      case 'inativo':
        return 'status-inativo';
      default:
        return '';
    }
  };

  return (
    <div className="animal-card-content">
      <div className="animal-header">
        <div className="animal-info">
          <h3 className="animal-nome">{nome}</h3>
          <span className="animal-raca">{especie} • {raca}</span>
        </div>
        <span className={`status-badge ${getStatusColor()}`}>
          {status_animal}
        </span>
      </div>
      <div className="animal-tutor">
        <span className="tutor-nome">{nomeTutor}</span>
      </div>
    </div>
  );
};

export default ListarAnimaisCard;
