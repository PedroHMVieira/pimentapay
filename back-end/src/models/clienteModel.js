const pool = require('../dbconfig/db');

const Cliente = {
    buscarTodos: async () => {
        const [rows] = await pool.query('SELECT id, nome, email, telefone, saldo, data_cadastro, tipo_usuario FROM clientes');
        return rows;
    },

    buscarPorId: async (id) => {
        const [rows] = await pool.query('SELECT id, nome, email, telefone, saldo, senha, data_cadastro, tipo_usuario FROM clientes WHERE id = ?', [id]);
        return rows[0];
    },

    buscarPorEmail: async (email) => {
        const [rows] = await pool.query('SELECT id, nome, email, saldo, senha, tipo_usuario FROM clientes WHERE email = ?', [email]);
        return rows[0];
    },

    buscarPorEmailESenha: async (email, senha) => {
        const [rows] = await pool.query('SELECT id, nome, email, saldo, tipo_usuario FROM clientes WHERE email = ? AND senha = ?', [email, senha]);
        return rows[0];
    },

    criar: async (nome, email, senha, telefone) => {
        const [resultado] = await pool.query('INSERT INTO clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)', [nome, email, senha, telefone]);
        return resultado.insertId;
    },

    atualizar: async (id, nome, email, telefone) => {
        const [resultado] = await pool.query('UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?', [nome, email, telefone, id]);
        return resultado.affectedRows;
    },

    atualizarPerfil: async (id, nome, senha) => {
        const [resultado] = await pool.query('UPDATE clientes SET nome = ?, senha = ? WHERE id = ?', [nome, senha, id]);
        return resultado.affectedRows;
    },

    deletar: async (id) => {
        const [resultado] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
        return resultado.affectedRows;
    },

    atualizarSaldo: async (id, novoSaldo) => {
        const [resultado] = await pool.query('UPDATE clientes SET saldo = ? WHERE id = ?', [novoSaldo, id]);
        return resultado.affectedRows;
    }
};

module.exports = Cliente;