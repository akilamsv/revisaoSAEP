import { Router } from "express";
import ClienteController from "../controllers/clienteController.js";
import VeiculoController from "../controllers/VeiculoController.js";
import AgendamentoController from "../controllers/AgendamentoController.js";
import DashboardController from "../controllers/DashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.post('/login', (req, res) => AuthController.login(req, res));

router.use(authMiddleware);

//ROTAS PARA CLIENTES
router.get('/clientes', (req, res) => ClienteController.listar(req, res));
router.post('/clientes', (req, res) => ClienteController.criar(req, res));
router.put('/clientes/:id', (req, res) => ClienteController.atualizar(req, res));

//ROTAS PARA VEICULOS
router.get('/veiculos', (req, res) => VeiculoController.listar(req, res));
router.post('/veiculos', (req, res) => VeiculoController.criar(req, res));

//ROTAS PARA AGENDAMENTOS
router.get('/agendamentos', (req, res) => AgendamentoController.listar(req, res));
router.post('/agendamentos', (req, res) => AgendamentoController.criar(req, res));
router.patch('/agendamentos/:id/data', (req, res) => AgendamentoController.atualizarData(req, res));

//ROTA PARA DASHBOARD
router.get('/dashboard/resumo',(req, res) => DashboardController.resumo(req, res));

//ROTAS PARA AUTH
router.post('/logout', (req, res) => AuthController.logout(req,res));
router.get('/me', (req, res) => AuthController.me(req, res));

export default router;
