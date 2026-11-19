const express = require('express');
const app = express();
const authorsRoutes = require('./routes/authors');
const postsRoutes = require('./routes/posts');

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a la API MiniBlog');
});

app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});