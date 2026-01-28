import { Router } from 'express';
import animalRoutes from './AnimalRoutes';
import consultaRoutes from './ConsultaRoutes';
import funcionarioRoutes from './FuncionarioRoutes';
import pagamentoRoutes from './PagamentoRoutes';
import tutorRoutes from './TutorRoutes';

const router = Router();

router.use('/animais', animalRoutes);
router.use('/consultas', consultaRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/pagamentos', pagamentoRoutes);
router.use('/tutores', tutorRoutes);

export default router;
