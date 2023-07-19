import { OrderStatus } from '../enums/order-status';
import postgres from '../../../infrastructure/database/postgres';

const { database } = postgres;

export interface GetOrder {
    readonly id: string;
}

interface OrderProjection {
    readonly id: string;
    readonly name: string;
    readonly status: OrderStatus;
}

interface OrderItemProjection {
    readonly id: string;
    readonly product: string;
    readonly amount: number;
}

export interface GetOrderResult {
    readonly id: string;
    readonly name: string;
    readonly status: OrderStatus;
    readonly items: OrderItemProjection[];
}

export const HandleGetOrder = async (query: GetOrder) => {
    const orderSql = 'SELECT id, name, status FROM orders WHERE id = $1';
    const orderParams = [query.id];
    const order = await database.oneOrNone<OrderProjection>(orderSql, orderParams);

    if (!order) {
        return null;
    }

    const itemsSql = 'SELECT i.id, p.name, i.amount FROM order_items i LEFT JOIN products p ON p.id = i.product_id WHERE i.order_id = $1';
    const itemsParams = [query.id];
    const items = await database.any<OrderItemProjection>(itemsSql, itemsParams);

    const result: GetOrderResult = {
        ...order,
        items: items,
    };

    return result;
};
