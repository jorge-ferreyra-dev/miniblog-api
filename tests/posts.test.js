import { randomUUID } from 'node:crypto';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../db/config.js';

describe('Endpoints de publicaciones', () => {

    test('POST /posts crea una publicación válida', async () => {
        let authorId;

        try {
            // Preparación: crear un autor temporal
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor para POST',
                    email: `autor-post-${randomUUID()}@example.com`,
                    bio: 'Autor temporal'
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            // Ejecutar la operación que queremos probar
            const post = {
                author_id: authorId,
                title: 'Post de prueba',
                content: 'Post creado desde el test',
                published: true
            };

            const createdPost = await request(app)
                .post('/posts')
                .send(post);

            // Verificar la respuesta
            expect(createdPost.status).toBe(201);
            expect(createdPost.body.id).toEqual(expect.any(Number));
            expect(createdPost.body.title).toBe(post.title);
            expect(createdPost.body.content).toBe(post.content);
            expect(createdPost.body.author_id).toBe(authorId);
            expect(createdPost.body.published).toBe(true);

        } finally {
            // Limpiar primero las publicaciones y después el autor
            if (Number.isSafeInteger(authorId) && authorId > 0) {
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

    test('GET /posts/author/:author_id obtiene las publicaciones del autor', async () => {
        let authorId;
        let otherAuthorId;

        const author = {
            name: 'Autor para GET',
            email: `autor-get-${randomUUID()}@example.com`
        };

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send(author);

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            // Crear dos publicaciones del mismo autor
            const firstPost = await request(app)
                .post('/posts')
                .send({
                    author_id: authorId,
                    title: 'Primera publicación',
                    content: 'Contenido de la primera publicación',
                    published: true
                });

            expect(firstPost.status).toBe(201);

            const secondPost = await request(app)
                .post('/posts')
                .send({
                    author_id: authorId,
                    title: 'Segunda publicación',
                    content: 'Contenido de la segunda publicación',
                    published: false
                });

            expect(secondPost.status).toBe(201);

            // Crear otro autor para comprobar el filtrado
            const otherAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Otro autor',
                    email: `otro-autor-${randomUUID()}@example.com`
                });

            otherAuthorId = otherAuthor.body.id;

            expect(otherAuthor.status).toBe(201);
            expect(otherAuthorId).toEqual(expect.any(Number));

            const otherPost = await request(app)
                .post('/posts')
                .send({
                    author_id: otherAuthorId,
                    title: 'Publicación de otro autor',
                    content: 'Esta publicación no debe aparecer'
                });

            expect(otherPost.status).toBe(201);

            // Obtener únicamente las publicaciones del primer autor
            const response = await request(app)
                .get(`/posts/author/${authorId}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);

            const postIds = response.body.map(post => post.id);

            expect(postIds).toContain(firstPost.body.id);
            expect(postIds).toContain(secondPost.body.id);
            expect(postIds).not.toContain(otherPost.body.id);

            // Verificar la información obtenida mediante JOIN
            for (const post of response.body) {
                expect(post.author_id).toBe(authorId);
                expect(post.author_name).toBe(author.name);
                expect(post.author_email).toBe(author.email);
            }

        } finally {
            for (const id of [authorId, otherAuthorId]) {
                if (Number.isSafeInteger(id) && id > 0) {
                    await pool.query(
                        'DELETE FROM posts WHERE author_id = $1',
                        [id]
                    );

                    await pool.query(
                        'DELETE FROM authors WHERE id = $1',
                        [id]
                    );
                }
            }
        }
    });

    test('PUT /posts/:id actualiza una publicación existente', async () => {
        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor para PUT',
                    email: `autor-put-${randomUUID()}@example.com`
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const createdPost = await request(app)
                .post('/posts')
                .send({
                    author_id: authorId,
                    title: 'Título original',
                    content: 'Contenido original',
                    published: false
                });

            const postId = createdPost.body.id;

            expect(createdPost.status).toBe(201);
            expect(postId).toEqual(expect.any(Number));

            const updatedPost = {
                author_id: authorId,
                title: 'Título actualizado',
                content: 'Contenido actualizado',
                published: true
            };

            const response = await request(app)
                .put(`/posts/${postId}`)
                .send(updatedPost);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(postId);
            expect(response.body).toMatchObject(updatedPost);

            // Comprobar que los cambios se guardaron
            const persistedPost = await request(app)
                .get(`/posts/${postId}`);

            expect(persistedPost.status).toBe(200);
            expect(persistedPost.body.id).toBe(postId);
            expect(persistedPost.body).toMatchObject(updatedPost);

        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
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

    test('DELETE /posts/:id elimina una publicación existente', async () => {
        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor para DELETE',
                    email: `autor-delete-${randomUUID()}@example.com`
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const createdPost = await request(app)
                .post('/posts')
                .send({
                    author_id: authorId,
                    title: 'Publicación para eliminar',
                    content: 'Contenido temporal',
                    published: false
                });

            const postId = createdPost.body.id;

            expect(createdPost.status).toBe(201);
            expect(postId).toEqual(expect.any(Number));

            const response = await request(app)
                .delete(`/posts/${postId}`);

            expect(response.status).toBe(204);
            expect(response.text).toBe('');

            // Comprobar que la publicación ya no existe
            const deletedPost = await request(app)
                .get(`/posts/${postId}`);

            expect(deletedPost.status).toBe(404);
            expect(deletedPost.body.error).toBe('Post no encontrada');

            // Comprobar que el autor no fue eliminado
            const existingAuthor = await request(app)
                .get(`/authors/${authorId}`);

            expect(existingAuthor.status).toBe(200);

        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
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

});
