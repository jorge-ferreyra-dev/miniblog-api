const pool = require('../db/config');

async function getAllComments() {

    return await pool.query('SELECT comments.*, authors.name AS author_name, posts.title AS post_title FROM comments JOIN authors ON authors.id = comments.author_id JOIN posts ON posts.id = comments.post_id ORDER BY comments.id ASC');
}

async function getCommentsByPostId(postId) {

    return await pool.query('SELECT comments.*, authors.name AS author_name, posts.title AS post_title FROM comments JOIN authors ON authors.id = comments.author_id JOIN posts ON posts.id = comments.post_id WHERE comments.post_id = $1 ORDER BY comments.id ASC', [postId]);
}

async function createComment(post_id, author_id, content) {
    return await pool.query('INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *', [post_id, author_id, content.trim()]);
}

module.exports = { getAllComments, getCommentsByPostId, createComment };