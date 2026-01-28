import { label } from './../../../frontend/node_modules/@material-tailwind/react/types/components/checkbox.d';
import { name } from './../../../frontend/node_modules/@material-tailwind/react/types/components/select.d';
import Animal from '../models/Animal';
import { Model, HasManyGetAssociationsMixin, Sequelize, QueryTypes } from 'sequelize';
import { AnimalAttributes, AnimalInstance  } from '../models/Animal';
import { ConsultaInstance } from '../models/Consulta';
import Consulta from '../models/Consulta';
import sequelizeInstance from '../config/database';



export type CriarAnimalPayload = Omit<AnimalAttributes, 'id_animal' |'createdAt' | 'updatedAt'>;

export type AtualizarAnimalPayload = Partial<Omit<AnimalAttributes, 'id_animal'|  'createdAt' | 'updatedAt'>>;


class AnimalRepository {
    async criarAnimal(dados: CriarAnimalPayload): Promise<AnimalInstance> {
        return await Animal.create(dados) as AnimalInstance;
    }   

    async criarAnimalManualmente(dados: any): Promise<{id_animal: number} | any>{
        const query = `
            INSERT INTO "Animal" (nome, especie, raca, peso, sexo, data_nascimento, observacoes_medicas, status_animal, id_tutor, created_at, updated_at)
            VALUES (:nome, :especie, :raca, :peso, :sexo, :data_nascimento, :observacoes_medicas, :status_animal, :id_tutor, :createdAt, :updatedAt)`
        try{
            const agora = new Date();
            const [results] = await sequelizeInstance.query(query, {
                replacements:{
                    nome: dados.name,
                    especie: dados.especie,
                    raca: dados.raca,
                    peso: dados.peso,
                    sexo: dados.sexo,
                    data_nascimento: dados.data_nascimento,
                    observacoes_medicas: dados.observacoes_medicas || null,
                    status_animal: dados.status_animal || 'Ativo',
                    id_tutor: dados.id_tutor,
                    createdAt: agora, // Gerenciar manualmente
                    updatedAt: agora  // Gerenciar manualmente
                },
                type: QueryTypes.INSERT
            
            });
            console.log("Animal criado")
            return results || null
        } catch (error) {
            console.error("Erro ao criar animal com SQL:", error);
            throw error;
        }
    }

    async listarAnimais(): Promise<AnimalInstance[]> {
        return await Animal.findAll() as AnimalInstance[];
    }

    async listarAnimaisManualmente(): Promise<AnimalAttributes[]>{
        const query = `SELECT id_animal, nome, especie, raca, peso, sexo, data_nascimento, observacoes_medicas, status_animal, id_tutor, created_at AS "createdAt", updated_at AS "updatedAt" FROM "Animal";`;

        try{
            const animais = await sequelizeInstance.query<AnimalAttributes>(query,{
                type: QueryTypes.SELECT
            })
            return animais
        }catch (error) {
            console.error("Erro ao listar animais com SQL:", error);
            throw error;
        }
    }

    async buscarAnimalPorId(id: number): Promise<AnimalInstance | null> {
        return await Animal.findByPk(id) as AnimalInstance | null;
    }

    async buscarAnimalIDManualmente(id: number): Promise<AnimalAttributes | null>{
        const query = `SELECT id_animal, nome, especie, raca, peso, sexo, data_nascimento, observacoes_medicas, status_animal, id_tutor, created_at AS "createdAt", updated_at AS "updatedAt" FROM "Animal" WHERE id_animal = :id_animal;`;
        try {
            const animais = await sequelizeInstance.query<AnimalAttributes>(query, {
                replacements: { id_animal: id },
                type: QueryTypes.SELECT
            });
            return animais.length > 0 ? animais[0] : null;
        } catch (error) {
            console.error("Erro ao buscar animal por ID com SQL:", error);
            throw error;
        }
    }

    async buscarAnimalPorNome(nome: string): Promise<AnimalInstance | null> {
        const animal = await Animal.findOne({
            where: {nome: nome}
        });
        return animal as AnimalInstance | null;
    }

    async atualizarAnimal(id: number, dados: AtualizarAnimalPayload): Promise<AnimalInstance | null> {
        const animal = await this.buscarAnimalPorId(id);
        if (animal) {
            return await animal.update(dados) as AnimalInstance;
        } else {
             throw new Error(`Animal with id ${id} not found`);
        }
    }

    async deletarAnimal(id: number): Promise<void> {
        const animal = await this.buscarAnimalPorId(id);
        if (animal) {
            await animal.destroy();
        } else {
            throw new Error(`Animal with id ${id} not found`);
        }
    }


    async listarConsultasPorAnimal(id: number): Promise<ConsultaInstance[]> {
        const animal = await this.buscarAnimalPorId(id);
        if (!animal) {
            throw new Error(`Animal with id ${id} not found`);
        }
        
        const consultas = await Consulta.findAll({
            where: { id_animal: id },
            order: [['data_hora', 'DESC']]
        });
        
        return consultas;
    }
}

export default new AnimalRepository();

