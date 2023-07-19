import postgres from '../../../infrastructure/database/postgres';
import { ITask } from 'pg-promise';
import { Order, OrderPrimitives } from '../entities/order';
import { OrderItemPrimitives } from '../entities/order-item';
import { ValidationError } from '../../../infrastructure/errors/validation-error';
import OrderErrors from '../constants/errors';

const { database, pgp } = postgres;

const getPrimitiveById = async (id: string, tx?: ITask<unknown>) => {
    const db = tx ?? database;

    const orderSql = 'SELECT id, name, status FROM orders WHERE id = $1';
    const orderParams = [id];
    let order = await db.oneOrNone<OrderPrimitives>(orderSql, orderParams);

    if (!order) {
        return null;
    }

    const itemsSql = 'SELECT id, order_id, product_id, amount FROM order_items WHERE order_id = $1';
    const itemsParams = [id];
    const items = await db.any<OrderItemPrimitives>(itemsSql, itemsParams);

    order = {
        ...order,
        items: items,
    };

    return order;
};

const getById = async (id: string, tx?: ITask<unknown>) => {
    const order = await getPrimitiveById(id, tx);

    if (!order) {
        throw new ValidationError(OrderErrors.NotFound);
    }

    return Order.fromPrimitives(order);
};

const save = async (order: Order, tx?: ITask<unknown>) => {
    const addItemsSql = (items: OrderItemPrimitives[]) =>
        pgp.helpers.insert(
            items,
            [
                {
                    name: 'id',
                    cast: 'uuid',
                },
                {
                    name: 'product_id',
                    prop: 'productId',
                    cast: 'uuid',
                },
                {
                    name: 'order_id',
                    prop: 'orderId',
                    cast: 'uuid',
                },
                {
                    name: 'amount',
                    cast: 'int',
                },
            ],
            'order_items',
        );

    const updateItemsSql = (items: OrderItemPrimitives[]) =>
        pgp.helpers.update(
            items,
            [
                {
                    name: 'id',
                    cast: 'uuid',
                    cnd: true,
                },
                {
                    name: 'product_id',
                    prop: 'productId',
                    cast: 'uuid',
                },
                {
                    name: 'order_id',
                    prop: 'orderId',
                    cast: 'uuid',
                },
                {
                    name: 'amount',
                    cast: 'int',
                },
            ],
            'order_items',
        ) + ' WHERE v.id = t.id';

    await (tx || database).tx(async (t) => {
        const newOrder = order.toPrimitives();
        const existingOrder = await getPrimitiveById(newOrder.id, t);

        if (!existingOrder) {
            const addOrderParams = 'INSERT INTO orders(id, name, status) VALUES ($1, $2, $3)';
            const params = [newOrder.id, newOrder.name, newOrder.status];
            await t.none(addOrderParams, params);

            if (newOrder.items.length > 0) {
                await t.none(addItemsSql(newOrder.items));
            }
        } else {
            const updateOrderSql = 'UPDATE orders SET name = $2, status = $3 WHERE id = $1';
            const updateOrderParams = [newOrder.id, newOrder.name, newOrder.status];
            await t.none(updateOrderSql, updateOrderParams);

            const itemsToAdd = newOrder.items.filter((ni) => !existingOrder.items.some((ei) => ei.id === ni.id));
            const itemsToUpdate = newOrder.items.filter((ni) => existingOrder.items.some((ei) => ei.id === ni.id));
            const itemsToRemove = existingOrder.items.filter((ei) => !newOrder.items.some((ni) => ni.id === ei.id));

            if (itemsToAdd.length > 0) {
                await t.none(addItemsSql(itemsToAdd));
            }

            if (itemsToUpdate.length > 0) {
                await t.none(updateItemsSql(itemsToUpdate));
            }

            if (itemsToRemove.length > 0) {
                const values = pgp.helpers.values(itemsToRemove, [{ name: 'id', cast: 'uuid' }]);
                await t.none('DELETE FROM order_items WHERE id IN ' + values);
            }
        }
    });
};

const orderRepository = {
    getById,
    save,
};

export default orderRepository;
