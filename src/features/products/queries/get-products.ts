import postgres from '../../../infrastructure/database/postgres';

const { database } = postgres;

export interface GetProducts {
    readonly index: number;
    readonly size: number;
}

export interface GetProductsResult {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly stock: number;
}

export const HandleGetProducts = (query: GetProducts) => {
    const { index, size } = query;
    const sql = 'SELECT id, name, price, stock FROM products ORDER BY name LIMIT $1 OFFSET $2';
    const params = [size, index * size];
    return database.any<GetProductsResult>(sql, params);
};
