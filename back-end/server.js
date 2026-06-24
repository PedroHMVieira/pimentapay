const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./src/dbconfig/db');

const app = express();

app.use(cors());
app.use(express.json());

const clienteRoutes = require('./src/routes/clienteRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');

app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);

app.get('/', (req, res) => {
    res.send('Servidor do PimentaPay rodando!');
});

const PORT = process.env.PORT || 3000;

// Trava de segurança: só sobe a porta real se não for um teste automatizado
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

// Exporta o app para o Jest e o Supertest conseguirem acessar suas rotas internamente
module.exports = app;