import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Animal = sequelize.define(
    'Animal',
    {
        id_animal: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        especie: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        raca: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        peso: {
            type: DataTypes.DECIMAL(6,2),
            allowNull: false,
        },
        sexo: {
            type: DataTypes.CHAR(1),
            allowNull: false,
        },
        data_nascimento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        observacoes_medicas: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status_animal:{
            type: DataTypes.ENUM('Ativo', 'Inativo', 'Falecido'),
            allowNull: false,
        },
        id_tutor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Tutor', // Nome da tabela referenciada
                key: 'id_tutor' // Chave primária da tabela referenciada
            }
        },
    },
    {
        tableName: 'Animal',
        timestamps: true,
        underscored: true, // Usar snake_case para os nomes das colunas
    }
);
export default Animal;