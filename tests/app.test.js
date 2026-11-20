import { describe, test, expect } from 'vitest';
import  request  from 'supertest';
import app from '../app.js';

describe('Rutas generales de la API', () => {

    test('GET / devuelve el mensaje de bienvenida', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Bienvenido a la API MiniBlog');
});

test('GET /ruta-que-no-existe', async () => {
    const response = await request(app).get('/rutainexistente');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Ruta no encontrada');
});

test('POST /authors devuelve 400 cuando el JSON es inválido', async () => {
    const response = await request(app)
        .post('/authors')
        .set('Content-type', 'application/json')
        .send('{"name: Carlos"');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El cuerpo de la solicitud contiene un JSON inválido');   
});

});


