const PedidoModel = require('../models/pedidoModel');

const pedidoController = {
    criar: async (req, res) => {
        try {
            const { cliente_id, total, itens } = req.body;

            const resultPedido = await PedidoModel.criarPedido(cliente_id, total);
            const pedido_id = resultPedido.insertId;

            const valoresItens = itens.map(item => [pedido_id, item.id, item.precoFinal]);
            await PedidoModel.inserirItens(valoresItens);

            await PedidoModel.descontarSaldo(cliente_id, total);

            const valorDescontado = -Math.abs(parseFloat(total));

            console.log(`Salvando movimentação vinculada ao pedido: ${pedido_id}`);

            await PedidoModel.registrarMovimentacao(
                cliente_id,
                valorDescontado,
                `Pagamento do Pedido #${pedido_id}`,
                pedido_id
            );

            res.status(201).json({ mensagem: "Pedido realizado com sucesso!" });
        } catch (error) {
            console.error("Erro interno ao criar pedido:", error);
            res.status(500).json({ erro: 'Erro interno ao processar pedido', detalhes: error });
        }
    },

    listar: async (req, res) => {
        try {
            const pedidos = await PedidoModel.listarTodos();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    listarItens: async (req, res) => {
        try {
            const pedido_id = req.params.id;
            const itens = await PedidoModel.listarItensPorPedido(pedido_id);
            res.json(itens);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    atualizarStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const pedido = await PedidoModel.buscarPorId(id);

            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado' });
            }

            const statusReembolsavel = status === 'não atendido' || status === 'cancelado';
            const jaEstavaReembolsado = pedido.status === 'não atendido' || pedido.status === 'cancelado';

            if (statusReembolsavel && !jaEstavaReembolsado) {
                await PedidoModel.reembolsarSaldo(pedido.cliente_id, pedido.total);

                const valorDevolvido = Math.abs(parseFloat(pedido.total));

                await PedidoModel.registrarMovimentacao(
                    pedido.cliente_id,
                    valorDevolvido,
                    `Reembolso: Pedido #${id} (${status})`,
                    id
                );

                console.log(`Reembolso automático do pedido ${id} registrado.`);
            }

            await PedidoModel.atualizarStatus(id, status);
            res.json({ mensagem: `Status atualizado para: ${status}` });

        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            res.status(500).json({ erro: 'Erro ao atualizar o status do pedido' });
        }
    },

    limparHistorico: async (req, res) => {
        try {
            await PedidoModel.limparHistorico();
            res.json({ mensagem: "Histórico limpo com sucesso!" });
        } catch (error) {
            console.error("Erro ao limpar histórico:", error);
            res.status(500).json({ erro: 'Erro ao limpar histórico' });
        }
    },

    verExtrato: async (req, res) => {
        try {
            const { cliente_id } = req.params;
            const movimentacoes = await PedidoModel.listarMovimentacoesPorCliente(cliente_id);
            res.json(movimentacoes);
        } catch (error) {
            console.error("Erro ao buscar extrato:", error);
            res.status(500).json({ erro: 'Erro ao buscar extrato' });
        }
    }
};

module.exports = pedidoController;