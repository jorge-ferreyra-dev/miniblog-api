import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../app";
import pool from "../db/config";
import { randomUUID } from "node:crypto";

describe('Endpoints de comentarios', () => {

    test('POST /comments crea un comentario y devuelve 201', async () => {
        let authorId;

        try {
            const author = await pool.query(
                'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
                ['Autor temporal', `${randomUUID()}@test.com`]
            );

            authorId = author.rows[0].id;

            const post = await pool.query(
                'INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *',
                [authorId, 'Post temporal', 'Contenido del post']
            );

            const postId = post.rows[0].id;

            const response = await request(app)
                .post('/comments')
                .send({
                    post_id: postId,
                    author_id: authorId,
                    content: 'Excelente publicación'
                });

            expect(response.status).toBe(201);
            expect(response.body.id).toBeDefined();
            expect(response.body.post_id).toBe(postId);
            expect(response.body.author_id).toBe(authorId);
            expect(response.body.content).toBe('Excelente publicación');

        } finally {
            if (authorId) {
                await pool.query(
                    'DELETE FROM posts WHERE author_id = $1',
                    [authorId]
                );

                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('GET /comments devuelve 200 y un array', async () => {
        const response = await request(app)
            .get('/comments');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /comments/post/:post_id devuelve los comentarios de una publicación', async () => {
        let authorId;

        try {
            const author = await pool.query(
                'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
                ['Autor temporal', `${randomUUID()}@test.com`]
            );

            authorId = author.rows[0].id;

            const post1 = await pool.query(
                'INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *',
                [authorId, 'Primer post', 'Contenido']
            );

            const post2 = await pool.query(
                'INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *',
                [authorId, 'Segundo post', 'Contenido']
            );

            const postId1 = post1.rows[0].id;
            const postId2 = post2.rows[0].id;

            await pool.query(
                'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3)',
                [postId1, authorId, 'Primer comentario']
            );

            await pool.query(
                'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3)',
                [postId1, authorId, 'Segundo comentario']
            );

            await pool.query(
                'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3)',
                [postId2, authorId, 'Comentario de otro post']
            );

            const response = await request(app)
                .get(`/comments/post/${postId1}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);

            expect(
                response.body.every(comment => comment.post_id === postId1)
            ).toBe(true);

            expect(response.body[0].author_name).toBe('Autor temporal');
            expect(response.body[0].post_title).toBe('Primer post');

        } finally {
            if (authorId) {
                await pool.query(
                    'DELETE FROM posts WHERE author_id = $1',
                    [authorId]
                );

                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('POST /comments devuelve 400 si el contenido está vacío', async () => {
        const response = await request(app)
            .post('/comments')
            .send({
                post_id: 1,
                author_id: 1,
                content: ''
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            'El contenido debe ser un texto no vacío'
        );
    });

    test('DELETE /posts/:id elimina también sus comentarios asociados', async () => {
        let authorId;

        try {
            const author = await pool.query(
                'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
                ['Autor temporal', `${randomUUID()}@test.com`]
            );

            authorId = author.rows[0].id;

            const post = await pool.query(
                'INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *',
                [authorId, 'Post temporal', 'Contenido']
            );

            const postId = post.rows[0].id;

            await pool.query(
                'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3)',
                [postId, authorId, 'Comentario temporal']
            );

            const response = await request(app)
                .delete(`/posts/${postId}`);

            expect(response.status).toBe(204);
            expect(response.text).toBe('');

            const comments = await pool.query(
                'SELECT * FROM comments WHERE post_id = $1',
                [postId]
            );

            expect(comments.rowCount).toBe(0);

        } finally {
            if (authorId) {
                await pool.query(
                    'DELETE FROM posts WHERE author_id = $1',
                    [authorId]
                );

                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('DELETE /authors/:id devuelve 409 si tiene comentarios asociados', async () => {
        let postAuthorId;
        let commentAuthorId;

        try {
            const postAuthor = await pool.query(
                'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
                ['Autor del post', `${randomUUID()}@test.com`]
            );

            postAuthorId = postAuthor.rows[0].id;

            const commentAuthor = await pool.query(
                'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING *',
                ['Autor del comentario', `${randomUUID()}@test.com`]
            );

            commentAuthorId = commentAuthor.rows[0].id;

            const post = await pool.query(
                'INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *',
                [postAuthorId, 'Post temporal', 'Contenido']
            );

            const postId = post.rows[0].id;

            await pool.query(
                'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3)',
                [postId, commentAuthorId, 'Comentario temporal']
            );

            const response = await request(app)
                .delete(`/authors/${commentAuthorId}`);

            expect(response.status).toBe(409);
            expect(response.body.error).toBe(
                'No se puede eliminar un autor con comentarios asociados'
            );

            const authorResponse = await request(app)
                .get(`/authors/${commentAuthorId}`);

            expect(authorResponse.status).toBe(200);

        } finally {
            if (postAuthorId) {
                await pool.query(
                    'DELETE FROM posts WHERE author_id = $1',
                    [postAuthorId]
                );
            }

            if (commentAuthorId) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [commentAuthorId]
                );
            }

            if (postAuthorId) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [postAuthorId]
                );
            }
        }
    });

});