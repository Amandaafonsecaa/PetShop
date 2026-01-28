import Consulta from "../models/Consulta";
import { Model } from "sequelize";
import { AnimalInstance } from "../models/Animal";
import { ConsultaInstance, ConsultaAttributes } from "../models/Consulta";
import { Animal, Tutor, Funcionario } from '../models';

export type CriarConsultaPayload = Omit<
  ConsultaAttributes,
  "id_consulta" | "createdAt" | "updatedAt"
>;

export type AtualizarConsultaPayload = Partial<
  Omit<ConsultaAttributes, "id_consulta" | "createdAt" | "updatedAt">
>;

class ConsultaRepository {
  async criarConsulta(dados: CriarConsultaPayload): Promise<ConsultaInstance> {
    return (await Consulta.create(dados)) as ConsultaInstance;
  }

  async listarConsultas(): Promise<ConsultaInstance[]> {
    try {
      const consultas = await Consulta.findAll({
        include: [
          {
            model: Animal,
            as: 'animal',
            include: [{
              model: Tutor,
              as: 'tutor'
            }]
          },
          {
            model: Funcionario,
            as: 'funcionario'
          }
        ],
        order: [['data_hora', 'DESC']]
      });
      return consultas as ConsultaInstance[];
    } catch (error) {
      console.error('Erro ao listar consultas:', error);
      throw error;
    }
  }

  async buscarConsultaPorId(id: number): Promise<ConsultaInstance | null> {
    return await Consulta.findByPk(id, {
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [{
            model: Tutor,
            as: 'tutor'
          }]
        },
        {
          model: Funcionario,
          as: 'funcionario'
        }
      ]
    }) as ConsultaInstance | null;
  }

  async mostrarAnimalPorConsulta(id: number): Promise<AnimalInstance | null> {
    const consulta = await Consulta.findByPk(id, {
      include: [{
        model: Animal,
        as: 'animal'
      }]
    });
    if (!consulta) {
      throw new Error(`Consulta with id ${id} not found`);
    }

    return consulta.get('animal') as AnimalInstance;
  }

  async atualizarConsulta(
    id: number,
    dados: AtualizarConsultaPayload
  ): Promise<ConsultaInstance | null> {
    const consulta = await this.buscarConsultaPorId(id);
    if (!consulta) {
      throw new Error(`Consulta with id ${id} not found`);
    }
    return (await consulta.update(dados)) as ConsultaInstance;
  }

  async deletarConsulta(id: number): Promise<void> {
    const consulta = await this.buscarConsultaPorId(id);
    if (!consulta) {
      throw new Error(`Consulta with id ${id} not found`);
    }
    return await consulta.destroy();
  }
}

export default new ConsultaRepository();
