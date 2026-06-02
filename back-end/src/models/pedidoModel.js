const db = require('../dbconfig/db');

const PedidoModel = {
    criarPedido: async (cliente_id, total) => {
        const sql = "INSERT INTO pedidos (cliente_id, total) VALUES (?, ?)";
        const [result] = await db.query(sql, [cliente_id, total]);
        return result;
    },

    inserirItens: async (valoresItens) => {
        const sql = "INSERT INTO pedido_itens (pedido_id, produto_id, preco_final) VALUES ?";
        const [result] = await db.query(sql, [valoresItens]);
        return result;
    },

    descontarSaldo: async (cliente_id, total) => {
        const sql = "UPDATE clientes SET saldo = saldo - ? WHERE id = ?";
        const [result] = await db.query(sql, [total, cliente_id]);
        return result;
    },

    reembolsarSaldo: async (cliente_id, total) => {
        const sql = "UPDATE clientes SET saldo = saldo + ? WHERE id = ?";
        const [result] = await db.query(sql, [total, cliente_id]);
        return result;
    },

    atualizarStatus: async (pedido_id, status) => {
        const sql = "UPDATE pedidos SET status = ? WHERE id = ?";
        const [result] = await db.query(sql, [status, pedido_id]);
        return result;
    },

    buscarPorId: async (pedido_id) => {
        const sql = "SELECT * FROM pedidos WHERE id = ?";
        const [rows] = await db.query(sql, [pedido_id]);
        return rows[0];
    },

    listarTodos: async () => {
        const sql = `
            SELECT p.id, p.total, p.data_pedido, p.status, c.nome as cliente_nome 
            FROM pedidos p 
            JOIN clientes c ON p.cliente_id = c.id 
            ORDER BY p.id DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    listarItensPorPedido: async (pedido_id) => {
        const sql = `
            SELECT pi.*, pr.nome as produto_nome 
            FROM pedido_itens pi 
            JOIN produtos pr ON pi.produto_id = pr.id 
            WHERE pi.pedido_id = ?
        `;
        const [rows] = await db.query(sql, [pedido_id]);
        return rows;
    },

    limparHistorico: async () => {
        const sqlItens = "DELETE FROM pedido_itens WHERE pedido_id IN (SELECT id FROM pedidos WHERE status IN ('concluido', 'não atendido'))";
        const sqlPedidos = "DELETE FROM pedidos WHERE status IN ('concluido', 'não atendido')";

        await db.query(sqlItens);
        const [result] = await db.query(sqlPedidos);
        return result;
    },

    registrarMovimentacao: async (cliente_id, valor, descricao, pedido_id = null) => {
        const sql = `
            INSERT INTO movimentacoes_saldo 
            (cliente_id, valor, descricao, data_movimentacao, pedido_id) 
            VALUES (?, ?, ?, NOW(), ?)
        `;
        const [result] = await db.query(sql, [cliente_id, valor, descricao, pedido_id]);
        return result;
    },

    listarMovimentacoesPorCliente: async (cliente_id) => {
        const sql = "SELECT * FROM movimentacoes_saldo WHERE cliente_id = ? ORDER BY data_movimentacao DESC";
        const [rows] = await db.query(sql, [cliente_id]);
        return rows;
    }
};

module.exports = PedidoModel;