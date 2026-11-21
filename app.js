const express = require('express');
const app = express();
const authorsRoutes = require('./routes/authors');
const postsRoutes = require('./routes/posts');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('node:fs');
const path = require('node:path');

const openapiPath = path.join(__dirname, 'openapi.yaml');
const openapiDocument = YAML.parse(
    fs.readFileSync(openapiPath, 'utf8')
);

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get('/', (req, res) => {
    res.send('Bienvenido a la API MiniBlog');
});

app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);

// Middleware para rutas inexistentes
app.use((req, res) => {
    res.status(404).json({error: 'Ruta no encontrada'});
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'El cuerpo de la solicitud contiene un JSON inválido'
        });
    }

    res.status(500).json({
        error: 'Error interno del servidor'
    });
});

module.exports = app;