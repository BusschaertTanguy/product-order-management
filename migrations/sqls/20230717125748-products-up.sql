CREATE TABLE products
(
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price BIGINT NOT NULL,
    stock INTEGER NOT NULL
);
