import React, { useEffect, useState } from 'react';
import './ListarConsultas.css';

interface Animal {
  id_animal: number;
  nome: string;
}

interface Funcionario {
  id_funcionario: number;
  nome: string;
}

interface Consulta {
  id_consulta: number;
  id_animal: number;
  id_funcionario: number;
  data_hora: Date;
  status_consulta: 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento';
  preco: number;
  diagnostico: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConsultaEnriquecida extends Consulta {
  nomeAnimal: string;
  nomeFuncionario: string;
}

interface ListarConsultasProps {
  consultas: Consulta[];
  onEdit: (consulta: Consulta) => void;
  onDelete: (consulta: Consulta) => void;
  onView: (consulta: Consulta) => void;
}

const ListarConsultas: React.FC<ListarConsultasProps> = ({
  consultas,
  onEdit,
  onDelete,
  onView
}) => {
  const [consultasEnriquecidas, setConsultasEnriquecidas] = useState<ConsultaEnriquecida[]>([]);

  useEffect(() => {
    const enriquecerConsultas = async () => {
      const consultasComNomes = await Promise.all(
        consultas.map(async (consulta) => {
          let nomeAnimal = 'Carregando...';
          let nomeFuncionario = 'Carregando...';

          try {
            // Buscar nome do animal
            const animalResponse = await fetch(`http://localhost:3001/api/animais/${consulta.id_animal}`);
            if (animalResponse.ok) {
              const animal: Animal = await animalResponse.json();
              nomeAnimal = animal.nome;
            } else {
              nomeAnimal = 'Animal não encontrado';
            }

            // Buscar nome do funcionário
            const funcionarioResponse = await fetch(`http://localhost:3001/api/funcionarios/${consulta.id_funcionario}`);
            if (funcionarioResponse.ok) {
              const funcionario: Funcionario = await funcionarioResponse.json();
              nomeFuncionario = funcionario.nome;
            } else {
              nomeFuncionario = 'Funcionário não encontrado';
            }
          } catch (error) {
            console.error('Erro ao buscar detalhes da consulta:', error);
            nomeAnimal = 'Erro ao carregar';
            nomeFuncionario = 'Erro ao carregar';
          }

          return {
            ...consulta,
            nomeAnimal,
            nomeFuncionario
          };
        })
      );

      setConsultasEnriquecidas(consultasComNomes);
    };

    enriquecerConsultas();
  }, [consultas]);

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const formatarPreco = (preco: number) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Agendada': '#2563eb',
      'Realizada': '#059669',
      'Cancelada': '#dc2626',
      'Remarcada': '#d97706',
      'Não Compareceu': '#7c3aed',
      'Em Andamento': '#0891b2'
    };
    return colors[status] || '#6b7280';
  };

  if (consultasEnriquecidas.length === 0 && consultas.length > 0) {
    return <div className="consultas-list">Carregando consultas...</div>;
  }

  return (
    <div className="consultas-list">
      {consultasEnriquecidas.map((consulta) => (
        <div key={consulta.id_consulta} className="consulta-card">
          <div className="consulta-info">
            <div className="consulta-header">
              <h3>{consulta.nomeAnimal}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(consulta.status_consulta) }}
              >
                {consulta.status_consulta}
              </span>
            </div>
            <p><strong>Veterinário:</strong> {consulta.nomeFuncionario}</p>
            <p><strong>Data/Hora:</strong> {formatarData(consulta.data_hora)}</p>
            <p><strong>Preço:</strong> {formatarPreco(consulta.preco)}</p>
            {consulta.diagnostico && (
              <p><strong>Diagnóstico:</strong> {consulta.diagnostico}</p>
            )}
          </div>
          <div className="consulta-actions">
            <button onClick={() => onView(consulta)} className="btn-view">
              Ver Detalhes
            </button>
            <button onClick={() => onEdit(consulta)} className="btn-edit">
              Editar
            </button>
            <button onClick={() => onDelete(consulta)} className="btn-delete">
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListarConsultas;
