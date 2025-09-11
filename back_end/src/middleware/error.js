function errorHandler(err, req, res, _next) {
    console.error(err);

    // MySQL duplicate key
    if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Registro já existe (chave única violada).' });
    }

    // Zod
    if (err && err.name === 'ZodError') {
        return res.status(400).json({ error: 'Payload inválido', issues: err.issues });
    }

    res.status(500).json({ error: 'Erro interno' });
}

module.exports = { errorHandler };
