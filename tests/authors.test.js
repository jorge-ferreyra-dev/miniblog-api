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
        const result = await pool.query(
            'SELECT COALESCE(MAX(id), 0) AS max_id FROM authors'
        );

        const nonexistentId = Number(result.rows[0].max_id) + 1;

        if (nonexistentId > 2147483647) {
            throw new Error('No hay un ID disponible para esta prueba');
        }

        const response = await request(app)
            .delete(`/authors/${nonexistentId}`);

        expect(response.status).toBe(404);
    });
});

