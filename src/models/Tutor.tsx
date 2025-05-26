import { DataTypes } from "sequelize";
import sequelize from "../config/database";


const Tutor = sequelize.define(
    'Tutor',
    {
        id_tutor: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,    
        },
        nome: {
            type: DataTypes.STRING(255),
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

},{
    tableName: 'Tutor',
    timestamps: true,
    underscored: true, 
}
);
export default Tutor;