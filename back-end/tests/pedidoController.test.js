const pedidoController = require('../src/controllers/pedidoController');
const PedidoModel = require('../src/models/pedidoModel');

jest.mock('../src/models/pedidoModel');

describe('Pedido Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('criar', () => {
        it('Deve criar um pedido, inserir itens, descontar saldo e registrar a movimentação negativa', async () => {
            req.body = {
                cliente_id: 1,
                total: '50.00',
                itens: [
                    { id: 10, precoFinal: 25.00 },
                    { id: 11, precoFinal: 25.00 }
                ]
            };

            PedidoModel.criarPedido.mockResolvedValue({ insertId: 99 });

            await pedidoController.criar(req, res);

            expect(PedidoModel.inserirItens).toHaveBeenCalledWith([
                [99, 10, 25.00],
                [99, 11, 25.00]
            ]);

            expect(PedidoModel.descontarSaldo).toHaveBeenCalledWith(1, '50.00');

            expect(PedidoModel.registrarMovimentacao).toHaveBeenCalledWith(
                1,
                -50,
                'Pagamento do Pedido #99',
                99
            );

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Pedido realizado com sucesso!' });
        });

        it('Deve retornar 500 se ocorrer um erro no banco', async () => {
            req.body = { cliente_id: 1, total: '50.00', itens: [] };
            PedidoModel.criarPedido.mockRejectedValue(new Error('Falha no banco'));

            await pedidoController.criar(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: 'Erro interno ao processar pedido' }));
        });
    });

    describe('atualizarStatus', () => {
        it('Deve retornar 404 se o pedido não existir', async () => {
            req.params = { id: 99 };
            req.body = { status: 'concluído' };
            PedidoModel.buscarPorId.mockResolvedValue(null);

            await pedidoController.atualizarStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ erro: 'Pedido não encontrado' });
        });

        it('Deve apenas atualizar o status se for alterado para "preparando" (sem reembolso)', async () => {
            req.params = { id: 99 };
            req.body = { status: 'preparando' };

            PedidoModel.buscarPorId.mockResolvedValue({ cliente_id: 1, total: '50.00', status: 'pendente' });

            await pedidoController.atualizarStatus(req, res);

            expect(PedidoModel.atualizarStatus).toHaveBeenCalledWith(99, 'preparando');
            expect(PedidoModel.reembolsarSaldo).not.toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Status atualizado para: preparando' });
        });

        it('Deve realizar o estorno automático do saldo se o pedido for "cancelado"', async () => {
            req.params = { id: 99 };
            req.body = { status: 'cancelado' };

            PedidoModel.buscarPorId.mockResolvedValue({ cliente_id: 1, total: '50.00', status: 'pendente' });

            await pedidoController.atualizarStatus(req, res);

            expect(PedidoModel.reembolsarSaldo).toHaveBeenCalledWith(1, '50.00');

            expect(PedidoModel.registrarMovimentacao).toHaveBeenCalledWith(
                1,
                50,
                'Reembolso: Pedido #99 (cancelado)',
                99
            );

            expect(PedidoModel.atualizarStatus).toHaveBeenCalledWith(99, 'cancelado');
        });
    });
});