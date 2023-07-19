CREATE TABLE orders
(
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    status INTEGER NOT NULL
);

CREATE TABLE order_items
(
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    amount INTEGER NOT NULL
);
