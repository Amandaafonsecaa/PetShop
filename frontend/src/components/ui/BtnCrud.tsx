// src/components/Card/Card.tsx
import React from 'react';
import './BtncCrud.css';

// 1. Definir a interface para as props que o card vai receber
interface CardProps {
  imageUrl?: string;         // URL da imagem
  imageAlt?: string;        // Texto alternativo para a imagem (importante para acessibilidade!)
  title: string;            // Título do card
  description: string;      // Texto/descrição do card
}

// 2. Criar o componente funcional
const Card: React.FC<CardProps> = ({
  imageUrl,
  imageAlt = 'Imagem do card', 
  title,
  description
}) => {
  const cardContent = (
    <div className='btn-crud'>
      <img src={imageUrl} alt={imageAlt} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );

  return <div className="custom-card">{cardContent}</div>;
};

export default Card;