const pool = require('../db/config');

async function getAllAuthors() {
    return await pool.query('SELECT * FROM authors');
}

async function getAuthorById(id) {
    return await pool.query(
        'SELECT * FROM authors WHERE id = $1',
        [id]
    );
}

async function createAuthor(name, email, bio) {
    return await pool.query(
        'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
        [name, email, bio ?? null]
    );
}

async function updateAuthor(id, name, email, bio) {
    return await pool.query(
        'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *',
        [name, email, bio ?? null, id]
    );
}

async function deleteAuthor(id) {
    return await pool.query(
        'DELETE FROM authors WHERE id = $1 RETURNING *',
        [id]
    );
}

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
