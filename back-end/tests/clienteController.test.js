const clienteController = require('../src/controllers/clienteController');
const Cliente = require('../src/models/clienteModel');
const PedidoModel = require('../src/models/pedidoModel');
const bcrypt = require('bcrypt');

jest.mock('../src/models/clienteModel');
jest.mock('../src/models/pedidoModel', () => ({
    registrarMovimentacao: jest.fn()
}));
jest.mock('bcrypt');

describe('Cliente Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('criarCliente', () => {
        it('Deve retornar 400 se o e-mail for inválido', async () => {
            req.body = { nome: 'João', email: 'email-invalido', senha: 'password123' };

            await clienteController.criarCliente(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ erro: 'E-mail inválido.' });
        });

        it('Deve criar um cliente com sucesso e retornar 201', async () => {
            req.body = { nome: 'João', email: 'joao@teste.com', senha: 'password123', telefone: '1199999999' };

            bcrypt.hash.mockResolvedValue('senhaCriptografada');
            Cliente.criar.mockResolvedValue(1);

            await clienteController.criarCliente(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(Cliente.criar).toHaveBeenCalledWith('João', 'joao@teste.com', 'senhaCriptografada', '1199999999');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Cadastrado com sucesso!', id: 1 });
        });
    });

    describe('loginCliente', () => {
        it('Deve retornar 401 se o cliente não existir', async () => {
            req.body = { email: 'inexistente@teste.com', senha: '123' };
            Cliente.buscarPorEmail.mockResolvedValue(null);

            await clienteController.loginCliente(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'E-mail ou senha incorretos.' });
        });

        it('Deve realizar login com sucesso e retornar 200', async () => {
            req.body = { email: 'joao@teste.com', senha: 'password123' };
            const clienteMock = { id: 1, email: 'joao@teste.com', senha: 'senhaCriptografada' };

            Cliente.buscarPorEmail.mockResolvedValue(clienteMock);
            bcrypt.compare.mockResolvedValue(true);

            await clienteController.loginCliente(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Login realizado!', cliente: clienteMock });
        });
    });

    describe('atualizarSaldo', () => {
        it('Deve calcular a diferença, atualizar o saldo e registrar a movimentação', async () => {
            req.params = { id: 1 };
            req.body = { novoSaldo: 150, pedidoId: 99 };

            Cliente.buscarPorId.mockResolvedValue({ id: 1, saldo: '100.00' });
            Cliente.atualizarSaldo.mockResolvedValue(1);

            await clienteController.atualizarSaldo(req, res);

            expect(Cliente.atualizarSaldo).toHaveBeenCalledWith(1, 150);
            expect(PedidoModel.registrarMovimentacao).toHaveBeenCalledWith(
                1,
                50,
                'Crédito adicionado pelo Administrador',
                99
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Saldo atualizado com sucesso!' });
        });
    });
});