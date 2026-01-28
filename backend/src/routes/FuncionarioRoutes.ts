import { Router, RequestHandler } from 'express';
import FuncionarioController from '../controllers/FuncionarioController';

const router = Router();

router.post('/', FuncionarioController.criar as unknown as RequestHandler);
router.get('/', FuncionarioController.listar as unknown as RequestHandler);
router.get('/:id', FuncionarioController.buscarPorId as unknown as RequestHandler);
router.get('/nome/:nome', FuncionarioController.buscarPorNome as unknown as RequestHandler);
router.get('/:id/consultas', FuncionarioController.mostrarConsultasPorFuncionario as unknown as RequestHandler);
router.put('/:id', FuncionarioController.atualizar as unknown as RequestHandler);
router.delete('/:id', FuncionarioController.deletar as unknown as RequestHandler);

export default router;
