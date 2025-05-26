import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Pagamento = sequelize.define(
    'Pagamento',
    {
        id_pagamento: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_consulta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Consulta', // Nome da tabela referenciada
                key: 'id_consulta' // Chave primária da tabela referenciada
            }
        },
        valor: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        data_pagamento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        metodo: {
            type: DataTypes.ENUM('Cartão de Crédito', 'Cartão de Débito', 'Dinheiro', 'Pix', 'Transferência'),
            allowNull: false,
        },
        status_pagamento: {
            type: DataTypes.ENUM('Pendente', 'Pago', 'Cancelado', 'Reembolsado'),
            allowNull: false,
        },
    }
)