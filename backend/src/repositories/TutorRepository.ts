import { TutorInstance } from '../models/Tutor';
import { AnimalInstance } from '../models/Animal';
import { Model } from 'sequelize';
import Tutor from '../models/Tutor';
import { TutorCreationAttributes } from '../models/Tutor';

export type CriarTutorPayload = TutorCreationAttributes;
export type AtualizarTutorPayload = Partial<TutorCreationAttributes>;

class TutorRepository {
    async criarTutor(dados: CriarTutorPayload): Promise<TutorInstance>{
        return await Tutor.create(dados) as TutorInstance;
    }

    async listarTutors(): Promise<TutorInstance[]> {
        return await Tutor.findAll() as TutorInstance[];
    }

    async buscarTutorPorId(id: number): Promise<TutorInstance | null> {
        const tutor = await Tutor.findByPk(id) as TutorInstance | null;
        if (!tutor) {
            throw new Error(`Tutor com id ${id} não encontrado`);
        }
        return tutor;
    }

    async buscarTutorPorNome(nome: string):Promise<TutorInstance | null> {
        const tutor = await Tutor.findOne({
            where: { nome: nome }
        })
        if (!tutor) {
            throw new Error(`Tutor com nome ${nome} não encontrado`);
        }
        return tutor as TutorInstance;
    }

    async deletarTutor(id: number):Promise<void>{
        const tutor = await Tutor.findByPk(id) as TutorInstance | null;
        if (!tutor) {
            throw new Error(`Tutor com id ${id} não encontrado`);
        }
        return await tutor.destroy();
    }

    async buscarAnimaisPorTutor(id: number): Promise<AnimalInstance[]> {
        const tutor = await Tutor.findByPk(id) as TutorInstance | null;
        if (!tutor) {
            throw new Error(`Tutor com id ${id} não encontrado`);
        } else {
            return await tutor.getAnimais({
                order: [['nome', 'ASC']],
            }) as unknown as AnimalInstance[];
        }
    }
}

export default new TutorRepository();