const produtoController = require('../src/controllers/produtoController');
const Produto = require('../src/models/produtoModel');

jest.mock('../src/models/produtoModel');

describe('Produto Controller', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('listarProdutos', () => {
        it('Deve retornar 200 e a lista de produtos', async () => {
            const mockProdutos = [{ id: 1, nome: 'Hambúrguer', preco: '25.00' }];
            Produto.listarTodos.mockResolvedValue(mockProdutos);

            await produtoController.listarProdutos(req, res);

            expect(Produto.listarTodos).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProdutos);
        });

        it('Deve retornar 500 se o banco falhar ao listar', async () => {
            Produto.listarTodos.mockRejectedValue(new Error('Erro DB'));

            await produtoController.listarProdutos(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ erro: 'Erro ao buscar produtos.' });
        });
    });

    describe('criarProduto', () => {
        it('Deve retornar 400 se nome ou preço não forem informados', async () => {
            req.body = { descricao: 'Muito bom', categoria: 'Lanches' };

            await produtoController.criarProduto(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ erro: 'Nome e preço são obrigatórios.' });
        });

        it('Deve criar um produto com sucesso e retornar 201', async () => {
            req.body = { nome: 'Fritas', descricao: 'Porção', preco: '15.00', imagem: 'url', categoria: 'Porções' };
            Produto.criar.mockResolvedValue(5);

            await produtoController.criarProduto(req, res);

            expect(Produto.criar).toHaveBeenCalledWith('Fritas', 'Porção', '15.00', 'url', 'Porções');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto cadastrado com sucesso!', id: 5 });
        });
    });

    describe('atualizarProduto', () => {
        it('Deve retornar 404 se o produto não for encontrado (0 afetados)', async () => {
            req.params = { id: 99 };
            req.body = { nome: 'Novo Nome' };
            Produto.atualizar.mockResolvedValue(0);

            await produtoController.atualizarProduto(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto não encontrado.' });
        });

        it('Deve atualizar com sucesso e retornar 200', async () => {
            req.params = { id: 1 };
            req.body = { nome: 'Suco', descricao: '', preco: '10.00', imagem: '', categoria: 'Bebidas', ativo: true };
            Produto.atualizar.mockResolvedValue(1);

            await produtoController.atualizarProduto(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto atualizado com sucesso!' });
        });
    });

    describe('deletarProduto', () => {
        it('Deve retornar 404 se o produto a ser deletado não existir', async () => {
            req.params = { id: 99 };
            Produto.deletar.mockResolvedValue(0);

            await produtoController.deletarProduto(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto não encontrado.' });
        });

        it('Deve deletar com sucesso e retornar 200', async () => {
            req.params = { id: 1 };
            Produto.deletar.mockResolvedValue(1);

            await produtoController.deletarProduto(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ mensagem: 'Produto deletado com sucesso!' });
        });
    });
});