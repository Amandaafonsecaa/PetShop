import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Funcionario = sequelize.define(
    'Funcionario',
    {
        id_funcionario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        cargo: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        telefone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
    }
);
export default Funcionario;