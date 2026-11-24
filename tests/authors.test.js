import { randomUUID } from 'node:crypto';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../db/config.js';

describe('Endpoints de autores', () => {

    test('POST /authors crea un autor válido', async () => {
        const author = {
            name: 'Autor de prueba',
            email: `autor-${randomUUID()}@example.com`,
            bio: 'Autor creado durante un test'
        };

        let authorId;

        try {
            const response = await request(app)
                .post('/authors')
                .send(author);

            authorId = response.body.id;

            expect(response.status).toBe(201);
            expect(response.body.id).toEqual(expect.any(Number));
            expect(response.body.name).toBe(author.name);
            expect(response.body.email).toBe(author.email);
        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('GET /authors/:id obtiene un autor existente', async () => {
        const author = {
            name: 'Autor para GET',
            email: `autor-get-${randomUUID()}@example.com`,
            bio: 'Autor temporal'
        };

        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send(author);

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const response = await request(app)
                .get(`/authors/${authorId}`);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(authorId);
            expect(response.body.name).toBe(author.name);
            expect(response.body.email).toBe(author.email);
        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('DELETE /authors/:id devuelve 404 si no existe', async () => {
        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor temporal',
                    email: `autor-${randomUUID()}@example.com`
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            await pool.query(
                'DELETE FROM authors WHERE id = $1',
                [authorId]
            );

            const response = await request(app)
                .delete(`/authors/${authorId}`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Autor no encontrado');

        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('PUT /authors/:id devuelve 400 si el email es inválido', async () => {
        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor temporal',
                    email: `autor-${randomUUID()}@example.com`
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const response = await request(app)
                .put(`/authors/${authorId}`)
                .send({
                    name: 'Autor de prueba',
                    email: 'anaexample.com',
                    bio: 'Autor temporal'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                'El formato del email es inválido'
            );

        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('PUT /authors/:id actualiza un autor existente', async () => {
        let authorId;

        const updatedAuthor = {
            name: 'Autor actualizado',
            email: `actualizado-${randomUUID()}@example.com`,
            bio: 'Biografía actualizada'
        };

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor original',
                    email: `autor-${randomUUID()}@example.com`,
                    bio: 'Biografía original'
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const response = await request(app)
                .put(`/authors/${authorId}`)
                .send(updatedAuthor);

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(authorId);
            expect(response.body.name).toBe(updatedAuthor.name);
            expect(response.body.email).toBe(updatedAuthor.email);
            expect(response.body.bio).toBe(updatedAuthor.bio);

            const persistedAuthor = await request(app)
                .get(`/authors/${authorId}`);

            expect(persistedAuthor.status).toBe(200);
            expect(persistedAuthor.body).toMatchObject(updatedAuthor);

        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    test('POST /authors devuelve 409 si el email ya existe', async () => {
        const author = {
            name: 'Autor de prueba',
            email: `duplicado-${randomUUID()}@example.com`,
            bio: 'Autor temporal'
        };

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send(author);

            expect(createdAuthor.status).toBe(201);

            const response = await request(app)
                .post('/authors')
                .send(author);

            expect(response.status).toBe(409);
            expect(response.body.error).toBe(
                'El email ya está registrado'
            );

        } finally {
            await pool.query(
                'DELETE FROM authors WHERE email = $1',
                [author.email]
            );
        }
    });

    test('DELETE /authors/:id elimina un autor existente', async () => {
        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor para eliminar',
                    email: `eliminar-${randomUUID()}@example.com`
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const response = await request(app)
                .delete(`/authors/${authorId}`);

            expect(response.status).toBe(204);
            expect(response.text).toBe('');

            const deletedAuthor = await request(app)
                .get(`/authors/${authorId}`);

            expect(deletedAuthor.status).toBe(404);

        } finally {
            if (Number.isSafeInteger(authorId) && authorId > 0) {
                await pool.query(
                    'DELETE FROM authors WHERE id = $1',
                    [authorId]
                );
            }
        }
    });

    
    test('DELETE /authors/:id devuelve 409 si tiene publicaciones asociadas', async () => {
        let authorId;

        try {
            const createdAuthor = await request(app)
                .post('/authors')
                .send({
                    name: 'Autor con publicaciones',
                    email: `autor-post-${randomUUID()}@example.com`
                });

            authorId = createdAuthor.body.id;

            expect(createdAuthor.status).toBe(201);
            expect(authorId).toEqual(expect.any(Number));

            const createdPost = await request(app)
                .post('/posts')
                .send({
                    author_id: authorId,
                    title: 'Publicación temporal',
                    content: 'Contenido creado durante un test',
                    published: false
                });

            expect(createdPost.status).toBe(201);

            const response = await request(app)
                .delete(`/authors/${authorId}`);

            expect(response.status).toBe(409);
            expect(response.body.error).toBe(
                'No se puede eliminar un autor con publicaciones asociadas'
            );

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