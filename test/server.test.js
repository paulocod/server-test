const request = require('supertest');
const app = require('../src/server'); // Importa o servidor

describe('Testando o Servidor', () => {

    it('deve retornar Hello World com status 200', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello World');
    });

    it('deve retornar uma saudação personalizada com o nome', async () => {
        const response = await request(app).get('/hello/Paulo');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, Paulo');
    });

    it('deve retornar erro 400 se o parâmetro name não for fornecido', async () => {
    const response = await request(app).get('/hello/');  // A URL '/hello/' sem parâmetro
    expect(response.status).toBe(400);  // Espera-se um erro 400
    expect(response.body.error).toBe('Name parameter is required');  // Mensagem de erro
    });

    it('deve retornar erro 500 com mensagem customizada', async () => {
        const response = await request(app).get('/error');
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('This is a custom error!');
    });

    it('deve retornar saudação com o nome fornecido pela query', async () => {
        const response = await request(app).get('/greet?name=Paulo');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, Paulo');
    });

    it('deve retornar erro 400 se o parâmetro name não for fornecido na query', async () => {
        const response = await request(app).get('/greet');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Name is required');
    });

    it('deve retornar a soma dos números de 1 a 1000', async () => {
        const response = await request(app).get('/sum');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Sum of numbers from 1 to 1000 is: 500500');
    });
});

