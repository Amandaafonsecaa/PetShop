// src/components/Card/Card.tsx
import React from 'react';
import './BtnCrud.css';

// 1. Definir a interface para as props que o card vai receber
interface BtnCrudProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
}

// 2. Criar o componente funcional
const BtnCrud: React.FC<BtnCrudProps> = ({
  imageUrl,
  imageAlt,
  title,
  description,
  onClick,
  disabled = false
}) => {
  return (
    <button 
      className={`btn-crud ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={imageUrl} alt={imageAlt} />
      <div className="btn-crud-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </button>
  );
};

export default BtnCrud;