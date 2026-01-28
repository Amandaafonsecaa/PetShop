import { FuncionarioAttributes, FuncionarioInstance } from '../models/Funcionario';
import Funcionario from '../models/Funcionario';
import { Model, HasManyGetAssociationsMixin } from 'sequelize';
import { ConsultaInstance } from '../models/Consulta';
import Consulta from '../models/Consulta';

export type CriarFuncionarioPayload = Omit<FuncionarioAttributes, 'id_funcionario' | 'createdAt' | 'updatedAt'>;

export type AtualizarFuncionarioPayload = Partial<Omit<FuncionarioAttributes, 'id_funcionario' | 'createdAt' | 'updatedAt'>>;

class FuncionarioRepository {
    async criarFuncionario(dados: CriarFuncionarioPayload): Promise<FuncionarioInstance> {
        return await Funcionario.create(dados) as FuncionarioInstance;
    }

    async listarFuncionarios(): Promise<FuncionarioInstance[]> {
        return await Funcionario.findAll() as FuncionarioInstance[];
    }

    async buscarFuncionarioPorId(id: number): Promise<FuncionarioInstance | null> {
        const funcionario = await Funcionario.findByPk(id) as FuncionarioInstance | null;
        if (!funcionario) {
            throw new Error(`Funcionário com id ${id} não encontrado`);
        } else {
            return funcionario;
        }
    }

    async buscarFuncionarioPorNome(nome: string): Promise<FuncionarioInstance | null> {
        const funcionario = await Funcionario.findOne({
            where: { nome: nome }
        });
        if (!funcionario) {
            throw new Error(`Funcionário com nome ${nome} não encontrado`);
        } else {
            return funcionario as FuncionarioInstance;
        }
    }

    async mostrarConsultasPorFuncionario(id: number): Promise<ConsultaInstance[]> {
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            throw new Error(`Funcionário com id ${id} não encontrado`);
        }
        /*
        } else {
            return await funcionario.getConsultas({
                order: [['data_hora', 'DESC']],
            });
        }
        */
        const consultas = await Consulta.findAll({
            where: { id_funcionario: id },
            order: [['data_hora', 'DESC']]
        });
        
        return consultas;
    }

    async atualizarFuncionario(id: number, dados: AtualizarFuncionarioPayload): Promise<FuncionarioInstance | null> {
        const funcionario = await this.buscarFuncionarioPorId(id);
        if (!funcionario) {
            throw new Error(`Funcionário com id ${id} não encontrado`);
        }else{
            return await funcionario.update(dados) as FuncionarioInstance;
        }
    }

    async deletarFuncionario(id: number): Promise<void> {
        const funcionario = await Funcionario.findByPk(id) as FuncionarioInstance | null;
        if (!funcionario) {
            throw new Error(`Funcionário com id ${id} não encontrado`);
        }else{
            return await funcionario.destroy();
        }
    }


}
export default new FuncionarioRepository();