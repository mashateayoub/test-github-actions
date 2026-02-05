#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT
    );

    INSERT INTO users (name, age) VALUES ('John Doe', 30);
    INSERT INTO users (name, age) VALUES ('Jane Boe', 25);
    INSERT INTO users (name, age) VALUES ('John Moe', 30);
EOSQL
