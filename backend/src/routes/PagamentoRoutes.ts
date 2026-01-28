import { Router, RequestHandler } from 'express';
import PagamentoController from '../controllers/PagamentoController';

const router = Router();

router.post('/', PagamentoController.criar as unknown as RequestHandler);
router.get('/', PagamentoController.listarPagamento as unknown as RequestHandler);
router.get('/:id', PagamentoController.buscarPorId as unknown as RequestHandler);
router.put('/:id', PagamentoController.atualizar as unknown as RequestHandler);
router.delete('/:id', PagamentoController.deletar as unknown as RequestHandler);

export default router;
