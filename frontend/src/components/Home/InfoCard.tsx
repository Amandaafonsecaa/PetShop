import React from "react";
import './InfoCard.css'

interface InfoCardProps {
    titulo: string;
    valor: string | number;
    descricaoExtra?: string;
    icone?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ titulo, valor, descricaoExtra, icone }) => {

    return(
        <div className="inforCard">
            <div className="card-top">
                <h3>{titulo}</h3>
                <img src={icone} alt="" />
            </div>
            <div className="card-meio">
                {valor}
            </div>
            <div className="card-op">
                {descricaoExtra}
            </div>
        </div>
    );
}

export default InfoCard;