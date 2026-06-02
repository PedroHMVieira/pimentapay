const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/login', clienteController.loginCliente);

router.put('/perfil/:id', clienteController.atualizarDadosProprios);
router.put('/:id/saldo', clienteController.atualizarSaldo);

router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.obterCliente);
router.post('/', clienteController.criarCliente);

router.put('/:id', clienteController.atualizarCliente);

router.delete('/:id', clienteController.deletarCliente);

module.exports = router;