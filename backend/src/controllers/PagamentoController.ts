import PagamentoRepository from "../repositories/PagamentoRepository";
import { AtualizarPagamentoPayload, CriarPagamentoInput
 } from "../repositories/PagamentoRepository";
 import { Request, Response } from 'express';


 class PagamentoController{
    async criar(req: Request, res: Response):Promise<Response>{
        try{
            const{
            id_consulta,
            valor, 
            data_pagamento,
            metodo,
            status_pagamento
            } = req.body as CriarPagamentoInput;

            if(
            !id_consulta||
            !valor||
            !data_pagamento||
            !metodo||
            !status_pagamento){
                return res
                        .status(400)
                        .json({ error: "Informação necessária faltando" });
            }

            const dadoParaCriar: CriarPagamentoInput={
                id_consulta,
                valor, 
                data_pagamento,
                metodo,
                status_pagamento
            };

            const pagamentoNovo = await PagamentoRepository.criarPagamento(dadoParaCriar);
            return res.status(201).json(pagamentoNovo);

            } catch (error) {
                console.error("Erro ao criar pagameto:", error);
                return res.status(500).json({ error: "Erro interno do servidor" });
        }
     }


    async listarPagamento(req: Request, res: Response): Promise<Response>{
        try{
            const pagamentos = await PagamentoRepository.listarPagamentos();
            return res.status(200).json(pagamentos);
        }catch(error: any){
            console.error("Erro ao listar as consultas:", error);
            return res.status(500).json({error: "Erro interno do server"})
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<Response>{
            try{
                const id = parseInt(req.params.id)
                if(isNaN(id)){
                    return res.status(400).json({ error: "ID do pagamento inválido "})
                }
                const pagamento = await PagamentoRepository.buscarPagamentoPorId(id)
                return res.status(200).json(pagamento);
    
            }catch(error: any){
                console.error("Erro ao listar as pagamento:", error);
                return res.status(500).json({error: "Erro interno do server"})
            }
        }

    async atualizar(req: Request, res: Response):Promise<Response>{
        try{
            const id = parseInt(req.params.id)
            if(isNaN(id)){
                return res.status(400).json({ error: "ID do animal inválido "})
            }
            const dados: AtualizarPagamentoPayload = req.body;
            const pagamentoAtualizado = await PagamentoRepository.atualizarPagamento(id, dados);
            return res.status(200).json(pagamentoAtualizado);
        }catch (error: any){
            console.error("Erro ao atualizar ao pagamento:", error);
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
                    return res.status(400).json({ error: "ID do pagamento inválido "})
                }
                await PagamentoRepository.deletarPagamento(id);
                return res.status(204).send();
            }catch(error: any){
                console.error("Erro ao deletar o pagamento: ", error);
                return res.status(500).json({error: "Erro interno"})
            }
    }
    
}

export default new PagamentoController();
