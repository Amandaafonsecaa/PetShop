import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Consulta = sequelize.define(
    'Consulta',
    {
        id_consulta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_animal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Animal', // Nome da tabela referenciada
                key: 'id_animal' // Chave primária da tabela referenciada
            }
        },
         id_funcionario:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Funcionario',
                key: 'id_funcionario' 
            }
        },
        data_hora:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        diagnostico:{
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status_consulta: {
            type: DataTypes.ENUM('Agendada', 'Realizada', 'Cancelada','Remarcada', 'Não Compareceu', 'Em Andamento'),
            allowNull: false,
            defaultValue: 'Agendada'
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }
)