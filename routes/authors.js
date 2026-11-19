const express = require('express');
const router = express.Router();
const pool = require('../db/config');

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

    if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
        return res.status(400).json({ error: 'ID de autor inválido' });
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

        if(!name || !email) {
            return res.status(400).json({error: 'El nombre y el email son obligatorios'});
        }

        if(typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({error: 'El nombre debe ser un texto no vacio'});    
        }

        if(name.length > 100) {
            return res.status(400).json({error: 'El nombre no puede superar los 100 caracteres'});
        }

        if(typeof email !== 'string' || email.trim() === '') {
            return res.status(400).json({error: 'El email debe ser un texto no vacio'});
        }

        if(email.length > 150) {
            return res.status(400).json({error: 'El email no puede superar los 150 caracteres'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({error: 'El formato del email es inválido'});
        }

        if(bio != null && typeof bio !== 'string') {
            return res.status(400).json({error: 'La biografia debe contener texto'});
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
    const { name, email, bio } = req.body;

    if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
        return res.status(400).json({error: 'ID de autor inválido'});
    }

    if (!name || !email) {
        return res.status(400).json({error: 'El nombre y el email son obligatorios'});
    }

    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({error: 'El nombre debe ser un texto no vacío'});
    }

    if(name.length > 100) {
        return res.status(400).json({error: 'El nombre no puede superar los 100 caracteres'});
    }

    if (typeof email !== 'string' || email.trim() === '') {
        return res.status(400).json({error: 'El email debe ser un texto no vacío'});
    }

    if(email.length > 150) {
        return res.status(400).json({error: 'El email no puede superar los 150 caracteres'});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: 'El formato del email es inválido'});
    }

    if(bio != null && typeof bio !== 'string') {
        return res.status(400).json({error: 'La biografía debe contener texto'});
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
    if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
        return res.status(400).json({error: 'ID de autor inválido'});
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