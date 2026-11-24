const express = require('express');
const app = express();
const authorsRoutes = require('./routes/authors');
const postsRoutes = require('./routes/posts');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('node:fs');
const path = require('node:path');
const { notFound } = require('./middlewares/notFound.middleware.js');
const { errorHandler } = require('./middlewares/error.middleware.js');

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
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor únicamente si se ejecuta app.js directamente
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app;