//sequelize que faz a comunicaçao com o mysql
import { Dialect, Options, Sequelize } from 'sequelize';


//dados do banco
const dbName = process.env.DB_NAME || 'clinicaveterinaria';
const dbUser = 'root';
const dbPassword = '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307;
const dbDialect: Dialect =  'mysql';

//configurar o Sequelize
const sequelizeOptions: Options = {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: console.log, //para mostrar as queries que ta fazendo
    define: {
        timestamps: true,
        underscored: true, 
    }
};

//intância para conexao com BD
const sequelizeInstance = new Sequelize(
  dbName,
  dbUser,
  dbPassword, 
  sequelizeOptions
);

(async () => {
  try {
    // tenta verificar as credenciais
    await sequelizeInstance.authenticate();
    console.log(`Conectado ao banco de dados '${dbName}' com sucesso.`);

  } catch (error) {
    console.error('Não foi possível conectar ou sincronizar com o banco de dados:', error);
  }
})();

export default sequelizeInstance;