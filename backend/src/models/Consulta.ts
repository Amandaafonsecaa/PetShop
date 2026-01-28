import {
  DataTypes,
  Model,
  Optional,
  BelongsToGetAssociationMixin,
  // Se precisar de outros métodos como setAnimal, importe os Mixins correspondentes
} from "sequelize";
import sequelize from "../config/database";
import { AnimalInstance } from "./Animal";
import { FuncionarioInstance } from "./Funcionario";

export interface ConsultaAttributes {
  id_consulta: number;
  id_animal: number;
  id_funcionario: number;
  data_hora: Date; 
  diagnostico: string | null;
  status_consulta: 'Agendada' | 'Realizada' | 'Cancelada' | 'Remarcada' | 'Não Compareceu' | 'Em Andamento';
  preco: number; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConsultaCreationAttributes
  extends Optional<ConsultaAttributes, 'id_consulta' | 'createdAt' | 'updatedAt'> {}

export interface ConsultaInstance extends Model<ConsultaAttributes, ConsultaCreationAttributes>,
  ConsultaAttributes {
  getAnimal: BelongsToGetAssociationMixin<AnimalInstance>;
  getFuncionario: BelongsToGetAssociationMixin<FuncionarioInstance>;
  animal?: AnimalInstance;
  funcionario?: FuncionarioInstance;
}

const Consulta = sequelize.define<ConsultaInstance>(
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
    },
    {
        tableName: 'Consulta', // Nome da tabela no banco de dados
        timestamps: true, // Habilita createdAt e updatedAt
        underscored: true, // Usar snake_case para os nomes das colunas

    }
)

export default Consulta;
