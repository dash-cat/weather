CREATE DATABASE mydatabase;

\c mydatabase;

CREATE TABLE mytable (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50)
);

INSERT INTO mytable (name, email) VALUES ('John Doe', 'john.doe@example.com');