const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { validateId } = require('../validators/common.validator.js');
const { validateRequiredFields, validateTitle, validateContent, validatePublished } = require('../validators/posts.validator.js');

// GET /posts/author/:author_id - obtener posts de un autor determinado
router.get('/author/:author_id', async (req, res) => {
    const authorId = Number(req.params.author_id);

    const authorIdValidation = validateId(authorId, 'Id de autor es inválido');

    if (!authorIdValidation.valid) {
        return res.status(400).json({
            error: authorIdValidation.error
        });
    }

    try {
        const author = await pool.query(
            'SELECT id FROM authors WHERE id = $1',
            [authorId]
        );

        if (author.rows.length === 0) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }

        const result = await pool.query(
            'SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.author_id = $1',
            [authorId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener publicaciones del autor', error.message);
        res.status(500).json({ error: 'Error al obtener publicaciones del autor' });
    }
});

// GET /posts - listar posts
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');

        res.json(result.rows);

    } catch (error) {
        console.error('Error al obtener posts', error.message);
        res.status(500).json({ error: 'Error al obtener posts' });
    }
});

// GET /posts/:id - detalle post
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const idValidation = validateId(id, 'ID de post inválido');

    if (!idValidation.valid) {
        return res.status(400).json({
            error: idValidation.error
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM posts WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrada' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al obtener post', error.message);
        res.status(500).json({ error: 'Error al obtener post' });
    }
});

// POST /posts - crear post
router.post('/', async (req, res) => {
    const { author_id, title, content, published } = req.body ?? {};

    const requiredFieldsValidation = validateRequiredFields(author_id, title, content);

    if (!requiredFieldsValidation.valid) {
        return res.status(400).json({
            error: requiredFieldsValidation.error
        });
    }

    const authorIdValidation = validateId(author_id, 'ID de autor inválido');

    if (!authorIdValidation.valid) {
        return res.status(400).json({
            error: authorIdValidation.error
        });
    }

    const titleValidation = validateTitle(title);

    if (!titleValidation.valid) {
        return res.status(400).json({
            error: titleValidation.error
        });
    }

    const contentValidation = validateContent(content);

    if (!contentValidation.valid) {
        return res.status(400).json({
            error: contentValidation.error
        });
    }

    const publishedValidation = validatePublished(published);

    if (!publishedValidation.valid) {
        return res.status(400).json({
            error: publishedValidation.error
        });
    }

    try {
        const result = await pool.query(
            'INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *',
            [author_id, title.trim(), content.trim(), published ?? false]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                error: 'El autor indicado no existe'
            });
        }

        console.error('Error al crear post', error.message);
        res.status(500).json({ error: 'Error al crear publicación' });
    }
});

// PUT /posts/:id - actualizar post
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { author_id, title, content, published } = req.body ?? {};

    const idValidation = validateId(id, 'Id del post inválido');

    if (!idValidation.valid) {
        return res.status(400).json({
            error: idValidation.error
        });
    }

    const requiredFieldsValidation = validateRequiredFields(author_id, title, content);

    if (!requiredFieldsValidation.valid) {
        return res.status(400).json({
            error: requiredFieldsValidation.error
        });
    }

    const authorIdValidation = validateId(author_id, 'ID de autor inválido');

    if (!authorIdValidation.valid) {
        return res.status(400).json({
            error: authorIdValidation.error
        });
    }

    const titleValidation = validateTitle(title);

    if (!titleValidation.valid) {
        return res.status(400).json({
            error: titleValidation.error
        });
    }

    const contentValidation = validateContent(content);

    if (!contentValidation.valid) {
        return res.status(400).json({
            error: contentValidation.error
        });
    }

    const publishedValidation = validatePublished(published);

    if (!publishedValidation.valid) {
        return res.status(400).json({
            error: publishedValidation.error
        });
    }

    try {
        const result = await pool.query(
            'UPDATE posts SET author_id = $1, title = $2, content = $3, published = $4 WHERE id = $5 RETURNING *',
            [author_id, title.trim(), content.trim(), published ?? false, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrada' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({
                error: 'El id ingresado no corresponde a ningún autor'
            });
        }

        console.error('Error al actualizar post', error.message);
        res.status(500).json({ error: 'Error al actualizar post' });
    }
});

// DELETE /posts/:id - eliminar post
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const idValidation = validateId(id, 'Id de post inválido');

    if (!idValidation.valid) {
        return res.status(400).json({
            error: idValidation.error
        });
    }

    try {
        const result = await pool.query(
            'DELETE FROM posts WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Post no encontrada' });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Error al eliminar post', error.message);
        res.status(500).json({ error: 'Error al eliminar post' });
    }
});

module.exports = router;