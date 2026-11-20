
import { randomUUID } from 'node:crypto';
import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../db/config.js';

describe('Endpoints de publicaciones', () => {
    test('POST /posts crea una publicación válida', async () => {
        let authorId;
        let postId;

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

            postId = createdPost.body.id;

            // Verificar la respuesta
            expect(createdPost.status).toBe(201);
            expect(createdPost.body.id).toEqual(expect.any(Number));
            expect(createdPost.body.title).toBe(post.title);
            expect(createdPost.body.content).toBe(post.content);
            expect(createdPost.body.author_id).toBe(authorId);
        } finally {
            // Limpiar primero la publicación y después el autor
            try {
                if (Number.isSafeInteger(postId) && postId > 0) {
                    await pool.query(
                        'DELETE FROM posts WHERE id = $1',
                        [postId]
                    );
                }
            } finally {
                if (Number.isSafeInteger(authorId) && authorId > 0) {
                    await pool.query(
                        'DELETE FROM authors WHERE id = $1',
                        [authorId]
                    );
                }
            }
        }
    });
});

