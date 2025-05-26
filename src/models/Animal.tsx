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
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        raca: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        peso: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        sexo: {
            type: DataTypes.STRING(1),
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
    }
);
export default Animal;