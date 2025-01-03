const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 3000;

// Middleware para parsear JSON, mas sem limite de tamanho (vulnerabilidade de DOS)
app.use(express.json({ limit: '50mb' })); // Configuração desnecessariamente alta
app.use(helmet.hidePoweredBy());
// Variável global problemática
let globalState = null;

// Função insegura (permissão de execução arbitrária de código)
function insecureFunction(userInput) {
    return eval(userInput); // Uso de eval: vulnerabilidade de segurança crítica
}

// Endpoint com uso inseguro de eval
app.get('/exec', (req, res) => {
    const userInput = req.query.code; // Entrada do usuário sem validação
    if (!userInput) {
        return res.status(400).send('Code query parameter is required');
    }
    const result = insecureFunction(userInput); // Execução arbitrária de código
    res.status(200).send(`Result: ${result}`);
});

// Loop infinito que pode travar o servidor
app.get('/infinite-loop', (req, res) => {
    while (true) {
        // Nada acontece aqui, trava o servidor
    }
});

// Erro silencioso: código falha, mas nada é informado
app.get('/silent-crash', (req, res) => {
    try {
        const result = JSON.parse("{invalidJson}");
    } catch (err) {
        // Silêncio absoluto
    }
    res.status(200).send("Something went wrong, but you won't know what.");
});

// Endpoint vulnerável a XSS
app.get('/xss', (req, res) => {
    const userInput = req.query.input; // Entrada do usuário
    res.status(200).send(`Hello, ${userInput}`); // Saída sem sanitização
});

// Vulnerabilidade de segurança: acesso não autorizado
app.get('/admin', (req, res) => {
    if (req.query.admin === "true") {
        res.status(200).send("Access granted to admin resources.");
    } else {
        res.status(403).send("Access denied.");
    }
});

// Código duplicado (somando novamente de 1 a 1000)
app.get('/duplicate-sum', (req, res) => {
    let sum = 0;
    for (let i = 1; i <= 1000; i++) {
        sum += i;
    }
    res.status(200).send(`Sum: ${sum}`);
});

app.get('/another-duplicate-sum', (req, res) => {
    let sum = 0;
    for (let i = 1; i <= 1000; i++) {
        sum += i;
    }
    res.status(200).send(`Sum: ${sum}`);
});

// Falha em fechar conexões de recursos externos
app.get('/leak', (req, res) => {
    const fs = require('fs');
    const stream = fs.createReadStream('nonexistent.file'); // Arquivo não existe
    stream.on('data', (chunk) => {
        console.log(chunk);
    });
    res.status(200).send("Streaming a non-existent file.");
});

// Endpoint com erro explícito
app.get('/throw-error', (req, res) => {
    throw new Error("This is an unhandled error.");
});

// Problema de desempenho: array muito grande
app.get('/memory-issue', (req, res) => {
    const largeArray = new Array(1e9).fill(0); // Criação de array gigante
    res.status(200).send(`Array created with size: ${largeArray.length}`);
});

// Função com código morto
function deadCode() {
    return;
    console.log("This will never run.");
}

// Iniciando o servidor
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
