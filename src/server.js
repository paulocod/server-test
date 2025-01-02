const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Rota simples para retornar "Hello World"
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// Rota para retornar uma saudação com o nome fornecido
app.get('/hello/:name?', (req, res) => {  // O ponto de interrogação torna o parâmetro `name` opcional
    const name = req.params.name;
    if (!name) {
        return res.status(400).send({ error: 'Name parameter is required' });
    }
    res.status(200).send(`Hello, ${name}`);
});

// Rota para retornar um erro customizado
app.get('/error', (req, res) => {
    try {
        throw new Error("This is a custom error!");
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Rota que utiliza um query parameter para dar uma saudação personalizada
app.get('/greet', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).send({ error: 'Name is required' });
    }
    res.status(200).send(`Hello, ${name}`);
});

// Rota que demonstra uma boa prática de loop para somar números
app.get('/sum', (req, res) => {
    let sum = 0;
    for (let i = 1; i <= 1000; i++) {
        sum += i; // Somando números de 1 a 1000 de forma eficiente
    }
    res.status(200).send(`Sum of numbers from 1 to 1000 is: ${sum}`);
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app; // Exportando para testes


