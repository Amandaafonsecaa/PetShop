import { DataTypes, Model, Optional, HasManyAddAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import sequelize from "../config/database";
import { ConsultaInstance } from "./Consulta"; // Correto, se Consulta.ts exporta 'export interface ConsultaInstance ...'

export interface AnimalAttributes {
  id_animal: number;
  nome: string;
  especie: string;
  raca: string;
  peso: number;
  sexo: string;
  data_nascimento: Date; 
  observacoes_medicas: string | null;
  status_animal: 'Ativo' | 'Inativo' | 'Falecido';
  id_tutor: number;
  createdAt?: Date;
  updatedAt?: Date;
}

//atributos que n precisam identificar
export interface AnimalCreationAttributes
  extends Optional<AnimalAttributes, 'id_animal' | 'status_animal' | 'createdAt' | 'updatedAt'> {}

//métodos para pegar informaçao
export interface AnimalInstance
  extends Model<AnimalAttributes, AnimalCreationAttributes>,
  AnimalAttributes {
  getConsultas: HasManyGetAssociationsMixin<ConsultaInstance>;
}

const Animal = sequelize.define<AnimalInstance>(
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
            defaultValue: 'Ativo', 
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