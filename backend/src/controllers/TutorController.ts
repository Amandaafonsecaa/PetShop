import { RealDataType } from "sequelize";
import TutorRepository from "../repositories/TutorRepository";
import { CriarTutorPayload, AtualizarTutorPayload } from "../repositories/TutorRepository";
import { Request, Response } from 'express';
import { TutorCreationAttributes } from "../models/Tutor";

class TutorController{
    async criar(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, telefone, email } = req.body as CriarTutorPayload;
            
            if (!nome || !telefone || !email) {
                return res
                    .status(400)
                    .json({ error: "Informação necessária faltando" });
            }

            const dadosParaCriar: CriarTutorPayload = {
                nome,
                telefone,
                email
            };

            const novoTutor = await TutorRepository.criarTutor(dadosParaCriar);
            return res.status(201).json(novoTutor);
        } catch (error) {
            console.error("Erro ao criar tutor:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async listar(req: Request, res: Response): Promise<Response>{
        try{
            const tutor = await TutorRepository.listarTutors();
            return res.status(200).json(tutor);
        }catch (error: any){
            console.error("Erro ao listar as tutor:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }
    async buscarTutorPorId(req: Request, res: Response): Promise<Response>{
        try{
            const id = parseInt(req.params.id);
             if(isNaN(id)){
                return res.status(400).json({ error: "ID do tutor inválido "})
            }
            const tutor = await TutorRepository.buscarTutorPorId(id);
            return res.status(200).json(tutor);
        }catch(error: any){
            console.error("Erro ao listar os tutores:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async buscarTutorPorNome(req: Request, res: Response): Promise<Response>{
        try{
            const nome = req.params.nome;
            const tutor = await TutorRepository.buscarTutorPorNome(nome);
            return res.status(200).json(tutor);
        }catch(error: any){
            console.error("Erro ao listar os tutores:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async deletar(req: Request, res: Response): Promise<Response>{
        try{
            const id = parseInt(req.params.id);
             if(isNaN(id)){
                return res.status(400).json({ error: "ID do tutor inválido "})
             }
             await TutorRepository.deletarTutor(id);
            return res.status(204).send();
        }catch(error: any){
            console.error("Erro ao deletar o tutor: ", error);
            return res.status(500).json({error: "Erro interno"})
        }
    }

    async buscarAnimalPorTutor(req: Request, res: Response): Promise<Response>{
        try{
            const id = parseInt(req.params.id);
            if(isNaN(id)){
                return res.status(400).json({ error: "ID do tutor inválido "})
             }
             const animal = await TutorRepository.buscarAnimaisPorTutor(id);
             return res.status(200).json(animal);
        }catch(error: any){
            console.error("Erro ao listar os tutores: ", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }
}

export default new TutorController();
