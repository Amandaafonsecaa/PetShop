import { BelongsToGetAssociationMixin, DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { ConsultaInstance } from "./Consulta";

export interface PagamentoAttributes {
    id_pagamento: number;
    id_consulta: number; 
    valor: number; 
    data_pagamento: Date; 
    metodo: 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Pix' | 'Transferência'; 
    status_pagamento: 'Pendente' | 'Pago' | 'Cancelado' | 'Reembolsado'; 
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PagamentoCreationAttributes 
extends Optional<PagamentoAttributes, 'id_pagamento' | 'createdAt' | 'updatedAt'> {}

export interface PagamentoInstance extends Model<PagamentoAttributes, PagamentoCreationAttributes>, PagamentoAttributes {
    getConsultas: BelongsToGetAssociationMixin<ConsultaInstance>;
}

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
            type: DataTypes.DECIMAL(10, 2),
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
            defaultValue: 'Pendente'
        },
    },
    {
        tableName: 'Pagamento', // Nome da tabela no banco de dados
        timestamps: true, // Habilita createdAt e updatedAt
        underscored: true, // Usar snake_case para os nomes das colunas
    }
)

export default Pagamento;