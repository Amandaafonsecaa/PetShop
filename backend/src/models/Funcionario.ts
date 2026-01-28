import { DataTypes,
    Model,
    Optional,
    BelongsToGetAssociationMixin,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
 } from "sequelize";
import sequelize from "../config/database";
import { ConsultaInstance } from "./Consulta";

export interface FuncionarioAttributes {
    id_funcionario: number;
    nome: string;
    cargo: string;
    telefone: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FuncionarioCreationAttributes
    extends Optional<FuncionarioAttributes, 'id_funcionario' | 'createdAt' | 'updatedAt'> {}

export interface FuncionarioInstance extends Model<FuncionarioAttributes, FuncionarioCreationAttributes>,
    FuncionarioAttributes {
        getConsultas: HasManyGetAssociationsMixin<ConsultaInstance>;
    }

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
    },
    {
        tableName: 'Funcionario',
        timestamps: true,
        underscored: true, // Usar snake_case para os nomes das colunas
    }
);
export default Funcionario;