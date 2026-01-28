import { Sequelize } from 'sequelize';
import sequelizeInstance from '../config/database';

// Importação dos modelos
import Tutor from './Tutor';
import Animal from './Animal';
import Funcionario from './Funcionario';
import Consulta from './Consulta';
import Pagamento from './Pagamento';

// Definição das associações
// Associações Tutor-Animal
Tutor.hasMany(Animal, {
  foreignKey: 'id_tutor',
  as: 'animais'
});
Animal.belongsTo(Tutor, {
  foreignKey: 'id_tutor',
  as: 'tutor'
});

// Associações Animal-Consulta
Animal.hasMany(Consulta, {
  foreignKey: 'id_animal',
  as: 'consultas'
});
Consulta.belongsTo(Animal, {
  foreignKey: 'id_animal',
  as: 'animal'
});

// Associações Funcionário-Consulta
Funcionario.hasMany(Consulta, {
  foreignKey: 'id_funcionario',
  as: 'consultas'
});
Consulta.belongsTo(Funcionario, {
  foreignKey: 'id_funcionario',
  as: 'funcionario'
});

// Associações Consulta-Pagamento
Consulta.hasOne(Pagamento, {
  foreignKey: 'id_consulta',
  as: 'pagamento'
});
Pagamento.belongsTo(Consulta, {
  foreignKey: 'id_consulta',
  as: 'consulta'
});

// Exporta as associações
export { Animal, Tutor, Funcionario, Consulta, Pagamento };

const db = {
  sequelize: sequelizeInstance,
  Sequelize,
  Animal,
  Tutor,
  Funcionario,
  Consulta,
  Pagamento
};

// Sincroniza os modelos com o banco de dados
(async () => {
  try {
    await sequelizeInstance.sync();
    console.log('Modelos sincronizados com o banco de dados');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
})();

export default db;
