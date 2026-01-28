import { Router, RequestHandler } from 'express';
import TutorController from '../controllers/TutorController';

const router = Router();

router.get('/', TutorController.listar as unknown as RequestHandler);
router.post('/', TutorController.criar as unknown as RequestHandler);
router.get('/:id', TutorController.buscarTutorPorId as unknown as RequestHandler);
router.get('/nome/:nome', TutorController.buscarTutorPorNome as unknown as RequestHandler);
router.delete('/:id', TutorController.deletar as unknown as RequestHandler);
router.get('/:id/animais', TutorController.buscarAnimalPorTutor as unknown as RequestHandler);

export default router;
