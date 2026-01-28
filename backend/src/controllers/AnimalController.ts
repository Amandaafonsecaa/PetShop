import { Request, Response } from 'express';
import  AnimalRepository  from '../repositories/AnimalRepository';
import { CriarAnimalPayload, AtualizarAnimalPayload } from '../repositories/AnimalRepository';
//TODO DUVIDA SOBRE ATRIBUTOS A POR ENUM
class AnimalController {
  async criar(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, especie, raca, peso, sexo, data_nascimento, id_tutor, observacoes_medicas, status_animal} =
        req.body as CriarAnimalPayload;
      if (
        !nome ||
        !especie ||
        !raca ||
        !peso ||
        !sexo ||
        !data_nascimento ||
        !id_tutor ||
        !status_animal
      ) {
        return res
          .status(400)
          .json({ error: "Informação necessária faltando" });
      }
      const dadosParaCriar: CriarAnimalPayload = {
        nome,
        especie,
        raca,
        peso,
        sexo,
        data_nascimento,
        id_tutor,
        observacoes_medicas,
        status_animal: 'Ativo'
      };
      const novoAnimal = await AnimalRepository.criarAnimal(dadosParaCriar);
      return res.status(201).json(novoAnimal);
    } catch (error) {
      console.error("Erro ao criar animal:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async listar(req: Request, res: Response): Promise<Response>{
    try{
      const animal = await AnimalRepository.listarAnimais();
      return res.status(200).json(animal);
    }catch (error: any){
      console.error("Erro ao listar animais:", error);
      return res.status(500).json({error: "Erro interno do server"})
    }
  }

  async buscarPorId(req: Request, res: Response ): Promise<Response>{
    try{
      const id = parseInt(req.params.id);
      if(isNaN(id)){
        return res.status(400).json({ error: "ID do animal inválido "})
      }
      const animal = await AnimalRepository.buscarAnimalPorId(id);
      if(!animal){
        return res.status(404).json({ error: "Animal ${id} não encontrado "})
      }
      return res.status(200).json(animal)
    }catch(error: any){
      console.error("Erro ao buscar animal por ID:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async atualizar (req: Request, res: Response): Promise<Response>{
    try{
      const id = parseInt(req.params.id);
      if(isNaN(id)){
        return res.status(400).json({ error: "ID do animal inválido "})
      }
      const dados: AtualizarAnimalPayload = req.body;
      const animalAtualizado = await AnimalRepository.atualizarAnimal(id, dados);
      if(!animalAtualizado){
        return res.status(404).json({ error: "Animal com ID ${id} não encondo"})
      }
      return res.status(200).json(animalAtualizado);
    } catch (error: any){
      console.error("Erro ao atualizar animal:", error);
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Erro de validação ou dados duplicados na atualização', details: error.errors?.map((e: any) => e.message) || error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async deletar (req: Request, res: Response): Promise<Response>{
    try{
      const id = parseInt(req.params.id);
      if(isNaN(id)){
          return res.status(400).json({ error: "ID do animal inválido "})
      }
      await AnimalRepository.deletarAnimal(id);
      return res.status(204).send();
    }catch(error: any){
      console.error("Erro ao deletar animal: ", error);
      return res.status(500).json({error: "Erro interno"})
    }
  }

  async listarConsultas (req: Request, res: Response): Promise<Response>{
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID do animal inválido.' });
      }
      const consultas = await AnimalRepository.listarConsultasPorAnimal(id);
      return res.status(200).json(consultas);
    } catch(error: any) {
      console.error(`Erro ao listar consultas para o animal ${req.params.id}:`, error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro ao buscar consultas do animal. Por favor, tente novamente." });
    }
  }
}

export default new AnimalController();
