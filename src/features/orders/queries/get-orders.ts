import { OrderStatus } from '../enums/order-status';
import postgres from '../../../infrastructure/database/postgres';

const { database } = postgres;

export interface GetOrders {
    readonly index: number;
    readonly size: number;
}

export interface GetOrdersResult {
    readonly id: string;
    readonly name: string;
    readonly status: OrderStatus;
}

export const HandleGetOrders = (query: GetOrders) => {
    const { index, size } = query;
    const sql = 'SELECT id, name, status FROM orders ORDER BY name LIMIT $1 OFFSET $2';
    const params = [size, index * size];
    return database.any<GetOrdersResult>(sql, params);
};
