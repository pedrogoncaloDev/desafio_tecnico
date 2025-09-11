const express = require('express');
const { pool } = require('../db');
const { z } = require('zod');

const router = express.Router();

// --------- Schemas (Zod) ----------
const baseSchema = z.object({
    idUsuario: z.number().int().positive(),
    Codigo: z.string().min(1).max(15),
    Nome: z.string().min(1).max(150),
    CPF_CNPJ: z.string().min(1).max(20),
    CEP: z.number().int().optional().nullable(),
    Logradouro: z.string().max(100).optional().nullable(),
    Endereco: z.string().max(120).optional().nullable(),
    Numero: z.string().max(20).optional().nullable(),
    Bairro: z.string().max(50).optional().nullable(),
    Cidade: z.string().max(60).optional().nullable(),
    UF: z.string().length(2).optional().nullable(),
    Complemento: z.string().max(150).optional().nullable(),
    Fone: z.string().max(15).optional().nullable(),
    LimiteCredito: z.number().optional().nullable(),
    Validade: z.string().date().optional().nullable() // aceita 'YYYY-MM-DD'
}).strict();

const createSchema = baseSchema;
const updateSchema = baseSchema.partial(); // PUT/PATCH parcial

// ---------- Helpers ----------
function pickFields(payload) {
    return [
        payload.idUsuario,
        payload.Codigo,
        payload.Nome,
        payload.CPF_CNPJ,
        payload.CEP ?? null,
        payload.Logradouro ?? null,
        payload.Endereco ?? null,
        payload.Numero ?? null,
        payload.Bairro ?? null,
        payload.Cidade ?? null,
        payload.UF ?? null,
        payload.Complemento ?? null,
        payload.Fone ?? null,
        payload.LimiteCredito ?? null,
        payload.Validade ?? null
    ];
}

// ---------- Rotas ----------

// GET /clientes?search=&page=1&limit=20
router.get('/', async (req, res, next) => {
    try {
        const search = String(req.query.search || '').trim();
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
        const offset = (page - 1) * limit;

        const where = [];
        const params = [];

        if (search) {
            where.push(`(Codigo LIKE ? OR Nome LIKE ? OR CPF_CNPJ LIKE ?)`);
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) as total FROM clientes ${whereSql}`,
            params
        );

        const [rows] = await pool.query(
            `SELECT *
         FROM clientes
         ${whereSql}
         ORDER BY ID DESC
         LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        res.json({ page, limit, total, rows });
    } catch (err) {
        next(err);
    }
});

// GET /clientes/:id
router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

        const [rows] = await pool.query(`SELECT * FROM clientes WHERE ID = ?`, [id]);
        if (!rows.length) return res.status(404).json({ error: 'Não encontrado' });

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /clientes
router.post('/', async (req, res, next) => {
    try {
        const payload = createSchema.parse(req.body);

        const sql = `
      INSERT INTO clientes (
        idUsuario, Codigo, Nome, CPF_CNPJ, CEP, Logradouro, Endereco, Numero,
        Bairro, Cidade, UF, Complemento, Fone, LimiteCredito, Validade
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
        const [result] = await pool.query(sql, pickFields(payload));

        const [rows] = await pool.query(`SELECT * FROM clientes WHERE ID = ?`, [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /clientes/:id  (atualização total ou parcial)
router.put('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

        const data = updateSchema.parse(req.body);
        if (!Object.keys(data).length) return res.status(400).json({ error: 'Nada para atualizar' });

        // monta SET dinâmico
        const columnsMap = {
            idUsuario: 'idUsuario',
            Codigo: 'Codigo',
            Nome: 'Nome',
            CPF_CNPJ: 'CPF_CNPJ',
            CEP: 'CEP',
            Logradouro: 'Logradouro',
            Endereco: 'Endereco',
            Numero: 'Numero',
            Bairro: 'Bairro',
            Cidade: 'Cidade',
            UF: 'UF',
            Complemento: 'Complemento',
            Fone: 'Fone',
            LimiteCredito: 'LimiteCredito',
            Validade: 'Validade'
        };

        const sets = [];
        const params = [];
        for (const [k, v] of Object.entries(data)) {
            if (columnsMap[k]) {
                sets.push(`${columnsMap[k]} = ?`);
                params.push(v ?? null);
            }
        }
        if (!sets.length) return res.status(400).json({ error: 'Campos inválidos' });

        const sql = `UPDATE clientes SET ${sets.join(', ')} WHERE ID = ?`;
        params.push(id);

        const [result] = await pool.query(sql, params);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Não encontrado' });

        const [rows] = await pool.query(`SELECT * FROM clientes WHERE ID = ?`, [id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /clientes/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

        const [result] = await pool.query(`DELETE FROM clientes WHERE ID = ?`, [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Não encontrado' });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
