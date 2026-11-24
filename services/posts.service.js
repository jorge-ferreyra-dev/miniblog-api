const pool = require('../db/config');

async function getPostsByAuthorId(authorId) {
    return await pool.query(
        'SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.author_id = $1',
        [authorId]
    );
}

async function getAllPosts() {
    return await pool.query('SELECT * FROM posts');
}

async function getPostById(id) {
    return await pool.query(
        'SELECT * FROM posts WHERE id = $1',
        [id]
    );
}

async function createPost(author_id, title, content, published) {
    return await pool.query(
        'INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *',
        [author_id, title.trim(), content.trim(), published ?? false]
    );
}

async function updatePost(id, author_id, title, content, published) {
    return await pool.query(
        'UPDATE posts SET author_id = $1, title = $2, content = $3, published = $4 WHERE id = $5 RETURNING *',
        [author_id, title.trim(), content.trim(), published ?? false, id]
    );
}

async function deletePost(id) {
    return await pool.query(
        'DELETE FROM posts WHERE id = $1',
        [id]
    );
}

module.exports = { getPostsByAuthorId, getAllPosts, getPostById, createPost, updatePost, deletePost };
