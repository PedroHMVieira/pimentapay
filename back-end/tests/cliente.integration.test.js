const request = require('supertest');
const app = require('../server');
const db = require('../src/dbconfig/db');

describe('Testes de Integração - Rotas de Cliente', () => {

    beforeAll(async () => {
        await db.query('DELETE FROM clientes WHERE email = ?', ['testador@pimentapay.com']);
    });

    afterAll(async () => {
        await db.end();
    });

    describe('POST /clientes', () => {
        it('Deve inserir o cliente no banco de dados e retornar 201', async () => {

            const novoCliente = {
                nome: 'Testador Silva',
                email: 'testador@pimentapay.com',
                senha: 'senha-super-segura',
                telefone: '11988887777'
            };

            const response = await request(app)
                .post('/clientes')
                .send(novoCliente);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('mensagem');

            const [clientesSalvos] = await db.query('SELECT * FROM clientes WHERE email = ?', ['testador@pimentapay.com']);
            expect(clientesSalvos.length).toBe(1);
            expect(clientesSalvos[0].nome).toBe('Testador Silva');
        });

        it('Deve retornar erro se o e-mail já estiver cadastrado', async () => {
            const clienteRepetido = {
                nome: 'Testador Silva',
                email: 'testador@pimentapay.com',
                senha: 'senha-super-segura',
                telefone: '11988887777'
            };

            const response = await request(app)
                .post('/clientes')
                .send(clienteRepetido);

            expect(response.status).not.toBe(201);
        });
    });
});