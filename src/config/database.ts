
import { Dialect, Options, Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'mydatabase';
const dbUser = 'root';
const dbPassword = '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307;
const dbDialect: Dialect =  'mysql';

const sequelizeOptions: Options = {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: console.log,
    define: {
        timestamps: true,
        underscored: true, // Use snake_case for column names
    }
};

const sequelizeInstance = new Sequelize(
  dbName,
  dbUser,
  dbPassword, 
  sequelizeOptions
);

(async () => {
  try {
    await sequelizeInstance.authenticate();
    console.log(`Conectado ao banco de dados '${dbName}' com sucesso.`);

  } catch (error) {
    console.error('Não foi possível conectar ou sincronizar com o banco de dados:', error);
  }
})();

export default sequelizeInstance;