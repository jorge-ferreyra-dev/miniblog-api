BEGIN;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
    content TEXT NOT NULL CHECK (TRIM(content) <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);

CREATE INDEX idx_comments_author_id ON comments(author_id);

COMMIT;