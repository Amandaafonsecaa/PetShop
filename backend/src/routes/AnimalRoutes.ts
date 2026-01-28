import { Router, RequestHandler } from 'express';
import AnimalController from '../controllers/AnimalController';

const router = Router();

router.post('/', AnimalController.criar as unknown as RequestHandler);
router.get('/', AnimalController.listar as unknown as RequestHandler);
router.get('/tutor/:id', AnimalController.listarConsultas as unknown as RequestHandler);
router.get('/:id', AnimalController.buscarPorId as unknown as RequestHandler);
router.put('/:id', AnimalController.atualizar as unknown as RequestHandler);
router.delete('/:id', AnimalController.deletar as unknown as RequestHandler);

export default router;




