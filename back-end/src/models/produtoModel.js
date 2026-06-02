const pool = require('../dbconfig/db');

const Produto = {
    listarTodos: async () => {
        const [rows] = await pool.query('SELECT * FROM produtos');
        return rows;
    },
    criar: async (nome, descricao, preco, imagem, categoria) => {
        const [resultado] = await pool.query('INSERT INTO produtos (nome, descricao, preco, imagem, categoria) VALUES (?, ?, ?, ?, ?)', [nome, descricao, preco, imagem, categoria]);
        return resultado.insertId;
    },
    atualizar: async (id, nome, descricao, preco, imagem, categoria, ativo) => {
        const [resultado] = await pool.query('UPDATE produtos SET nome = ?, descricao = ?, preco = ?, imagem = ?, categoria = ?, ativo = ? WHERE id = ?', [nome, descricao, preco, imagem, categoria, ativo, id]);
        return resultado.affectedRows;
    },
    deletar: async (id) => {
        const [resultado] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
        return resultado.affectedRows;
    }
};

module.exports = Produto;