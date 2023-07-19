import orderRepository from '../repositories/order-repository';
import postgres from '../../../infrastructure/database/postgres';
import { ValidationError } from '../../../infrastructure/errors/validation-error';
import { z } from 'zod';
import OrderErrors from '../constants/errors';
import CommonErrors from '../../common/constants/errors';

const { database, pgp } = postgres;

const validator = z.object({ id: z.string().uuid({ message: CommonErrors.InvalidId }) });
export type AcceptOrder = z.infer<typeof validator>;

export const HandleAcceptOrder = async (command: AcceptOrder) => {
    await validator.parseAsync(command);

    const order = await orderRepository.getById(command.id);
    order.accept();

    const products = await getProductsForOrder(order.id);

    for (const product of products) {
        const orderItem = order.getItem(product.id);
        const newStock = product.stock - orderItem.amount;

        if (newStock < 0) {
            throw new ValidationError(OrderErrors.AmountExceedsStock);
        }

        product.stock = newStock;
    }

    await database.tx(async (t) => {
        await orderRepository.save(order, t);
        await t.none(generateProductsBulkUpdateSql(products));
    });
};

const getProductsForOrder = (orderId: string) => {
    const productsSql = 'SELECT id, name, price, stock FROM products WHERE id IN (SELECT product_id FROM order_items WHERE order_id = $1)';
    const productsParams = [orderId];
    return database.any<{ readonly id: string; stock: number }>(productsSql, productsParams);
};

const generateProductsBulkUpdateSql = (products: { readonly id: string; stock: number }[]) => {
    return (
        pgp.helpers.update(
            products,
            [
                {
                    name: 'id',
                    cast: 'uuid',
                    cnd: true,
                },
                {
                    name: 'stock',
                    cast: 'int',
                },
            ],
            'products',
        ) + 'WHERE v.id = t.id'
    );
};
