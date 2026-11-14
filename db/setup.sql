CREATE TABLE authors (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(150) NOT NULL UNIQUE,
    bio TEXT, 
    created_at TIMESTAMPTZ DEFAULT NOW()
    );

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE RESTRICT 
);