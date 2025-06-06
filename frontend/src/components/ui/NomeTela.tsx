import React from "react";
import './NomeTela.css'
interface NomeTelaProps {
  message: string; 
}

export default function NomeTela({ message }: NomeTelaProps) {
  return (
    <div className="NomeTela">
      <h1>{message}</h1>
    </div>
  );
}