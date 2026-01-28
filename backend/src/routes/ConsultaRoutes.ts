import { Router, RequestHandler } from 'express';
import ConsultaController from '../controllers/ConsultaController';

const router = Router();

router.post('/', ConsultaController.criar as unknown as RequestHandler);
router.get('/', ConsultaController.listarConsultas as unknown as RequestHandler);
router.get('/:id', ConsultaController.buscarPorId as unknown as RequestHandler);
router.get('/:id/animal', ConsultaController.mostrarAnimalPorConsulta as unknown as RequestHandler);
router.put('/:id', ConsultaController.atualizar as unknown as RequestHandler);
router.delete('/:id', ConsultaController.deletar as unknown as RequestHandler);

export default router;
