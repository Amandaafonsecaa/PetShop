import { Request, Response } from 'express';
import ConsultaRepository from '../repositories/ConsultaRepository';
import { CriarConsultaPayload, AtualizarConsultaPayload } from '../repositories/ConsultaRepository';

class ConsultaController {
    async criar(req: Request, res: Response):Promise<Response>{
        try{
            const {id_animal,
                id_funcionario,
                data_hora, // Espera-se uma string de data (ex: ISO 8601) do cliente
                diagnostico,
                status_consulta, // Opcional do cliente
                preco} = req.body as CriarConsultaPayload;
            
                if(!id_animal||
                !id_funcionario ||
                !data_hora||
                !diagnostico||
                !status_consulta||
                !preco){
                    return res
                        .status(400)
                        .json({ error: "Informação necessária faltando" });
                }
                const dadosParaCriar: CriarConsultaPayload = {
                    id_animal,
                    id_funcionario,
                    data_hora, 
                    diagnostico,
                    status_consulta, 
                    preco
                };
                const novoAnimal = await ConsultaRepository.criarConsulta(dadosParaCriar);
                return res.status(201).json(novoAnimal);

        } catch (error) {
            console.error("Erro ao criar animal:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async listarConsultas(req: Request, res: Response): Promise<Response>{
        try{
            const consultas = await ConsultaRepository.listarConsultas();
            return res.status(200).json(consultas);
        }catch(error: any){
            console.error("Erro ao listar as consultas:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async mostrarAnimalPorConsulta(req: Request, res: Response): Promise<Response>{
        try{
            const id_consulta = parseInt(req.params.id);
            if(isNaN(id_consulta)){
                return res.status(400).json({ error: "ID da consulta inválido "})
            }
            const animal = await ConsultaRepository.mostrarAnimalPorConsulta(id_consulta);
            return res.status(200).json(animal);
        }catch(error: any){
           console.error("Erro ao listar animais:", error);
            return res.status(500).json({error: "Erro interno do server"}) 
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<Response>{
        try{
            const id = parseInt(req.params.id)
            if(isNaN(id)){
                return res.status(400).json({ error: "ID da consulta inválido "})
            }
            const consulta = await ConsultaRepository.buscarConsultaPorId(id)
            return res.status(200).json(consulta);

        }catch(error: any){
            console.error("Erro ao listar as consultas:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async atualizar(req: Request, res: Response):Promise<Response>{
        try{
            const id = parseInt(req.params.id)
            if(isNaN(id)){
                return res.status(400).json({ error: "ID do animal inválido "})
            }
            const dados: AtualizarConsultaPayload = req.body;
            const consultaAtualizada = await ConsultaRepository.atualizarConsulta(id, dados);
            return res.status(200).json(consultaAtualizada);
        }catch (error: any){
            console.error("Erro ao atualizar a consulta:", error);
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'Erro de validação ou dados duplicados na atualização', details: error.errors?.map((e: any) => e.message) || error.message });
            }
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async deletar(req: Request, res: Response):Promise<Response>{
        try{
            const id = parseInt(req.params.id)
            if(isNaN(id)){
                return res.status(400).json({ error: "ID do animal inválido "})
            }
            await ConsultaRepository.deletarConsulta(id);
            return res.status(204).send();
        }catch(error: any){
            console.error("Erro ao deletar a consulta: ", error);
            return res.status(500).json({error: "Erro interno"})
        }
    }
}

export default new ConsultaController();