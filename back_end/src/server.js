const express = require('express');
const { errorHandler } = require('./middleware/error');
const clientesRouter = require('./routes/clientes');
require('dotenv').config();

const app = express();
app.use(express.json());

// healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// rotas
app.use('/clientes', clientesRouter);

// erro
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
