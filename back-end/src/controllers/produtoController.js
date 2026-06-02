const Produto = require('../models/produtoModel');

exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.listarTodos();
        res.status(200).json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
};

exports.criarProduto = async (req, res) => {
    const { nome, descricao, preco, imagem, categoria } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ erro: 'Nome e preço são obrigatórios.' });
    }

    try {
        const novoId = await Produto.criar(nome, descricao, preco, imagem, categoria);
        res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', id: novoId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar o produto.' });
    }
};

exports.atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, imagem, categoria, ativo } = req.body;

    try {
        const afetados = await Produto.atualizar(id, nome, descricao, preco, imagem, categoria, ativo);

        if (afetados === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        res.status(200).json({ mensagem: 'Produto atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar o produto.' });
    }
};

exports.deletarProduto = async (req, res) => {
    try {
        const afetados = await Produto.deletar(req.params.id);
        if (afetados === 0) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        res.status(200).json({ mensagem: 'Produto deletado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao deletar o produto.' });
    }
};