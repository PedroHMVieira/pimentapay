const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.criar);
router.get('/', pedidoController.listar);
router.get('/:id/itens', pedidoController.listarItens);

router.put('/:id/status', pedidoController.atualizarStatus);

router.get('/extrato/:cliente_id', pedidoController.verExtrato);

router.delete('/historico', pedidoController.limparHistorico);

module.exports = router;