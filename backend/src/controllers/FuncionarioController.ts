import FuncionarioRepository from "../repositories/FuncionarioRepository";
import { AtualizarFuncionarioPayload, CriarFuncionarioPayload } from "../repositories/FuncionarioRepository";
import { Request, Response } from 'express';

class FuncionarioController{
    async criar(req: Request, res: Response): Promise<Response>{
        try{
            const {
                    nome,
                    cargo,
                    telefone,
                    email
            } = req.body as CriarFuncionarioPayload;
            if( !nome||
                !cargo||
                !telefone||
                !email){
                    return res
                        .status(400)
                        .json({ error: "Informação necessária faltando" });
                }
            const dadosParaCriar: CriarFuncionarioPayload={
                nome,
                cargo,
                telefone,
                email
            };
            const funcionarioNovo = await FuncionarioRepository.criarFuncionario(dadosParaCriar);
            return res.status(201).json(funcionarioNovo);
        } catch (error) {
            console.error("Erro ao criar funcionário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async listar(req: Request, res: Response): Promise<Response>{
        try{
            const funcionarios = await FuncionarioRepository.listarFuncionarios();
            return res.status(200).json(funcionarios);
        }catch(error: any){
            console.error("Erro ao listar os funcionarios :", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<Response>{
        try{
            const id = parseInt(req.params.id);
            if(isNaN(id)){
                return res.status(400).json({ error: "ID do funcionário] inválido "})
            }
            const funcionario = await FuncionarioRepository.buscarFuncionarioPorId(id);
            return res.status(200).json(funcionario);
        }catch(error: any){
            console.error("Erro ao listar as consultas:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async buscarPorNome(req: Request, res: Response): Promise<Response>{
        try{
            const nome = req.params.nome;
            const funcionario = await FuncionarioRepository.buscarFuncionarioPorNome(nome);
            return res.status(200).json(funcionario);
        }catch(error: any){
            console.error("Erro ao achar funcionário:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async mostrarConsultasPorFuncionario(req: Request, res: Response): Promise<Response>{
        try{
            const id_funcionario = parseInt(req.params.id);
            if(isNaN(id_funcionario)){
                return res.status(400).json({ error: "ID do funcionário] inválido "})
            }
            const listaConsultas = await FuncionarioRepository.mostrarConsultasPorFuncionario(id_funcionario);
            return res.status(200).json(listaConsultas);
        }catch(error: any){
            console.error("Erro ao achar funcionário:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

     async atualizar(req: Request, res: Response):Promise<Response>{
            try{
                const id = parseInt(req.params.id)
                if(isNaN(id)){
                    return res.status(400).json({ error: "ID do funcionário inválido "})
                }
                const dados: AtualizarFuncionarioPayload = req.body;
                const funcionarioAtualizado = await FuncionarioRepository.atualizarFuncionario(id, dados);
                return res.status(200).json(funcionarioAtualizado);
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
                        return res.status(400).json({ error: "ID do funcionário inválido "})
                    }
                    await FuncionarioRepository.deletarFuncionario(id);
                    return res.status(204).send();
                }catch(error: any){
                    console.error("Erro ao deletar a funcionário: ", error);
                    return res.status(500).json({error: "Erro interno"})
                }
        }
}

export default new FuncionarioController();
