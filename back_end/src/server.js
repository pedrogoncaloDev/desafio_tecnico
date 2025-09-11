const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/error');
const clientesRouter = require('./routes/clientes');
require('dotenv').config();

const app = express();

// CORS — antes das rotas
const allowed = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(s => s.trim());

app.use(cors({
    origin(origin, cb) {
        // permite tools sem Origin (curl, Postman)
        if (!origin) return cb(null, true);
        if (allowed.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,    // habilite se for usar cookies/credenciais
    maxAge: 86400
}));

// Preflight
app.options('*', cors());

app.use(express.json());

// healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// rotas
app.use('/clientes', clientesRouter);

// erro CORS explícito
app.use((err, req, res, next) => {
    if (err && err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Origin não permitido' });
    }
    return next(err);
});

// erro genérico
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
