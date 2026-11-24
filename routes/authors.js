const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { validateEmail, validateName, validateBio, validateRequiredFields } = require('../validators/authors.validator.js');
const { validateId } = require('../validators/common.validator.js');

// GET /authors - listar autores
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM authors');
        res.json(result.rows);
    }catch (error) {
        console.error('Error al obtener autores', error.message);
        res.status(500).json({error: 'Error al obtener autores'});
    }
});

// GET /authors/:id - detalle de autor
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    const idValidation = validateId(id, 'ID de autor inválido');

    if (!idValidation.valid) {
        return res.status(400).json({
            error: idValidation.error
        });
    }

    try {
        const result = await pool.query(
        'SELECT * FROM authors WHERE id = $1',
        [id]
        );
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Autor no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error obteniendo autor:', error);
        res.status(500).json({ error: 'Error obteniendo autor' });
    }
});

//* POST /authors - crea autor
router.post('/', async (req, res) => {

        const { name, email, bio } = req.body ?? {};

        const requiredFieldsValidation = validateRequiredFields(name, email);

        if (!requiredFieldsValidation.valid) {
            return res.status(400).json({
                error: requiredFieldsValidation.error
            });
        }

        const nameValidation = validateName(name);

        if(!nameValidation.valid) {
            return res.status(400).json({
                error: nameValidation.error
            });
        }

        const emailValidation = validateEmail(email);

        if (!emailValidation.valid) {
            return res.status(400).json({
                error: emailValidation.error
            });
        }

        const bioValidation = validateBio(bio);

        if (!bioValidation.valid) {
            return res.status(400).json({
                error: bioValidation.error
            });
        }

    try {
        const result = await pool.query('INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        [name, email, bio ?? null]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        if(error.code === '23505') {
            return res.status(409).json({error: 'El email ya está registrado'});
        }
        console.error('Error al crear autor:', error.message);
        res.status(500).json({ error: 'Error al crear autor' });
    }
});

// * PUT /authors/:id - actualizar autor
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, bio } = req.body ?? {};

    const idValidation = validateId(id, 'ID de autor inválido');

    if (!idValidation.valid) {
        return res.status(400).json({
            error: idValidation.error
        });
    }

    const requiredFieldsValidation = validateRequiredFields(name, email);

    if (!requiredFieldsValidation.valid) {
        return res.status(400).json({
            error: requiredFieldsValidation.error
        });
    }

    const nameValidation = validateName(name);

    if(!nameValidation.valid) {
        return res.status(400).json({
            error: nameValidation.error
        });
    }

    const emailValidation = validateEmail(email);

    if (!emailValidation.valid) {
        return res.status(400).json({
            error: emailValidation.error
        });
    }

    const bioValidation = validateBio(bio);

    if (!bioValidation.valid) {
        return res.status(400).json({
            error: bioValidation.error
        });
    }

    try {
        const result = await pool.query('UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *',
        [name, email, bio ?? null, id]);
        
        if(result.rows.length === 0) {
            return res.status(404).json({error: 'Autor no encontrado'});
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar autor', error.message);
        if(error.code === '23505') {
            return res.status(409).json({error: 'El email ya está registrado'});
        }
        res.status(500).json({error: 'Error al actualizar autor'});
    }
});

// * DELETE /author/:id - eliminar un autor
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    
    const idValidation = validateId(id, 'ID de autor inválido');

    if (!idValidation.valid) {
        return res.status(400).json({
            error: idValidation.error
        });
    }

    try {
        const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', 
        [id]);
        
        if(result.rowCount === 0) {
            return res.status(404).json({error: 'Autor no encontrado'});
        }

        res.status(204).send();

    } catch (error) {
        console.error('Error al eliminar autor', error.message);
        if(error.code === '23503') {
            return res.status(409).json({
                error: 'No se puede eliminar un autor con publicaciones asociadas'
            });
        }
        res.status(500).json({error: 'Error al eliminar autor'});
    }
});


module.exports = router;