const express = require('express');
const router = express.Router();

const { getAllComments, getCommentsByPostId, createComment } = require('../services/comments.service');

const { getPostById } = require('../services/posts.service');

const { validateId, validateContent } = require('../validators/common.validator');

const { validateRequiredFields } = require('../validators/comments.validator');

// GET /comments - listar comentarios
router.get('/', async (req, res) => {
    try {
        const result = await getAllComments();

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error al obtener comentarios', error.message);
        res.status(500).json({error: "Error al obtener comentarios"});
    }
});

// GET /comments/post/:post_id - obtener comentarios por publicación
router.get('/post/:post_id', async (req, res) => {
    const postId = Number(req.params.post_id);

    const postIdValidation = validateId(postId, "ID de post inválido");

    if(!postIdValidation.valid) {
        return res.status(400).json({
            error: postIdValidation.error
        });
    }

    try {

        const post = await getPostById(postId);

        if(post.rows.length === 0) {
            return res.status(404).json({
                error: "Post no encontrado"
            });
        }

        const result = await getCommentsByPostId(postId);

        res.status(200).json(result.rows);

    } catch(error) {
        console.error("Error al obtener comentarios de post", error.message);
        res.status(500).json({error: "Error al obtener comentarios de post"});
    }
});

// POST/comments - crear comentario
router.post('/', async (req, res) => {
    const { post_id, author_id, content } = req.body ?? {};

    const requiredFieldsValidation = validateRequiredFields(post_id, author_id, content);

    if(!requiredFieldsValidation.valid) {
        return res.status(400).json({
            error: requiredFieldsValidation.error
        })
    }

    const postIdValidation = validateId(post_id, "ID de post inválido");

    if(!postIdValidation.valid) {
        return res.status(400).json({
            error: postIdValidation.error
        });
    }

    const authorIdValidation = validateId(author_id, "ID de autor inválido");

    if(!authorIdValidation.valid) {
        return res.status(400).json({
            error: authorIdValidation.error
        });
    }

    const contentValidation = validateContent(content);

    if(!contentValidation.valid) {
        return res.status(400).json({
            error: contentValidation.error
        });
    }

    try {
        const result = await createComment(post_id, author_id, content);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === '23503' && error.constraint === 'comments_post_id_fkey') {
            return res.status(400).json({
                error: 'Publicación inexistente'
            });
        }

        if (error.code === '23503' && error.constraint === 'comments_author_id_fkey') {
            return res.status(400).json({
                error: 'Autor inexistente'
            });
        }

        console.error('Error al crear comentario', error.message);
        res.status(500).json({error: 'Error al crear comentario'});
    }
});

module.exports = router;