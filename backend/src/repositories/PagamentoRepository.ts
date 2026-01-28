import { Model } from 'sequelize';
import Pagamento from '../models/Pagamento';
import { PagamentoAttributes, PagamentoInstance } from '../models/Pagamento';

export interface CriarPagamentoInput {
  id_consulta: number;
  valor: number;
  metodo: PagamentoAttributes['metodo']; // Usa o tipo ENUM de PagamentoAttributes
  data_pagamento?: Date; // Opcional, pode usar a data atual como padrão
  status_pagamento?: PagamentoAttributes['status_pagamento']; // Opcional, usa o default do modelo
}

export type AtualizarPagamentoPayload = Partial<Omit<PagamentoAttributes, 'id_pagamento' | 'createdAt' | 'updatedAt'>>;

class PagamentoRepository {
    async criarPagamento(dados: CriarPagamentoInput): Promise<PagamentoInstance>{
        const consulta = await Pagamento.findByPk(dados.id_consulta); //nao entendi

        if (!consulta) {
            throw new Error(`Consulta com ID ${dados.id_consulta} não encontrada para criar o pagamento.`);
        }

        const dadosCriarPagamento = {
            id_consulta: dados.id_consulta,
            metodo: dados.metodo,
            data_pagamento: dados.data_pagamento || new Date(), 
            status_pagamento: dados.status_pagamento || 'Pendente',
        }

        return await Pagamento.create(dadosCriarPagamento) as PagamentoInstance;
    }

    async listarPagamentos(): Promise<PagamentoInstance[]> {
        return await Pagamento.findAll() as PagamentoInstance[];
    }

    async buscarPagamentoPorId(id: number): Promise<PagamentoInstance | null> {
        const pagamento = await Pagamento.findByPk(id) as PagamentoInstance | null;
        if (!pagamento) {
            throw new Error(`Pagamento com id ${id} não encontrado`);
        }
        return pagamento;
    }

    async atualizarPagamento(id: number, dados: AtualizarPagamentoPayload): Promise<PagamentoInstance | null> {
        const pagamento = await Pagamento.findByPk(id) as PagamentoInstance | null;
        if (!pagamento) {
            throw new Error(`Pagamento com id ${id} não encontrado`);
        }
        return await pagamento.update(dados) as PagamentoInstance;
    }

    async deletarPagamento(id: number): Promise<void> {
        const pagamento = await Pagamento.findByPk(id) as PagamentoInstance | null;
        if (!pagamento) {
            throw new Error(`Pagamento com id ${id} não encontrado`);
        }
        await pagamento.destroy();
    }
}
export default new PagamentoRepository();
