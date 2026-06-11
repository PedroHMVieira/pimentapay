const Cliente = require('../models/clienteModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.buscarTodos();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar clientes.' });
    }
};

exports.obterCliente = async (req, res) => {
    try {
        const cliente = await Cliente.buscarPorId(req.params.id);
        if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar o cliente.' });
    }
};

exports.criarCliente = async (req, res) => {
    const { nome, email, senha, telefone } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ erro: 'E-mail inválido.' });
    if (senha.length < 8) return res.status(400).json({ erro: 'Senha curta demais.' });

    try {
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const novoId = await Cliente.criar(nome, email, senhaCriptografada, telefone);
        res.status(201).json({ mensagem: 'Cadastrado com sucesso!', id: novoId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ erro: 'E-mail já existe.' });
        res.status(500).json({ erro: 'Erro ao criar cliente.' });
    }
};

exports.atualizarCliente = async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        const afetados = await Cliente.atualizar(req.params.id, nome, email, telefone);
        if (afetados === 0) return res.status(404).json({ mensagem: 'Não encontrado.' });
        res.status(200).json({ mensagem: 'Atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar.' });
    }
};

exports.deletarCliente = async (req, res) => {
    try {
        const afetados = await Cliente.deletar(req.params.id);
        if (afetados === 0) return res.status(404).json({ mensagem: 'Não encontrado.' });
        res.status(200).json({ mensagem: 'Deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar.' });
    }
};

exports.loginCliente = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const cliente = await Cliente.buscarPorEmail(email);
        if (!cliente) return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });

        const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
        if (!senhaCorreta) return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });

        res.status(200).json({ mensagem: 'Login realizado!', cliente });
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.atualizarSaldo = async (req, res) => {
    const { id } = req.params;
    const { novoSaldo, pedidoId } = req.body;

    try {
        const clienteAntes = await Cliente.buscarPorId(id);
        if (!clienteAntes) return res.status(404).json({ mensagem: 'Cliente não encontrado.' });

        const saldoAntigo = parseFloat(clienteAntes.saldo || 0);
        const saldoFinal = parseFloat(novoSaldo);
        const diferenca = saldoFinal - saldoAntigo;

        const afetados = await Cliente.atualizarSaldo(id, saldoFinal);

        if (diferenca !== 0 && afetados > 0) {
            const PedidoModel = require('../models/pedidoModel');

            let descricao = diferenca > 0
                ? "Crédito adicionado pelo Administrador"
                : "Compra de produtos (Débito)";

            const pId = pedidoId || null;

            await PedidoModel.registrarMovimentacao(
                id,
                diferenca,
                descricao,
                pId
            );
        }

        res.status(200).json({ mensagem: 'Saldo atualizado com sucesso!' });

    } catch (error) {
        console.error("ERRO CRÍTICO NO SALDO:", error);
        res.status(500).json({ erro: 'Erro ao atualizar saldo.', detalhes: error.message });
    }
};

exports.atualizarDadosProprios = async (req, res) => {
    const { id } = req.params;
    const { nome, senhaAntiga, novaSenha } = req.body;

    try {
        const cliente = await Cliente.buscarPorId(id);
        if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });

        const senhaAntigaValida = await bcrypt.compare(senhaAntiga, cliente.senha);
        if (!senhaAntigaValida) {
            return res.status(401).json({ erro: 'A senha atual está incorreta.' });
        }

        let senhaFinal = cliente.senha;
        if (novaSenha && novaSenha.trim() !== "") {
            if (novaSenha.length < 8) return res.status(400).json({ erro: 'Nova senha curta demais.' });
            senhaFinal = await bcrypt.hash(novaSenha, saltRounds);
        }

        await Cliente.atualizarPerfil(id, nome, senhaFinal);

        res.status(200).json({ mensagem: 'Dados updated com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar dados.' });
    }
};