import orderRepository from '../repositories/order-repository';
import OrderErrors from '../constants/errors';
import { z } from 'zod';
import CommonErrors from '../../common/constants/errors';

const validator = z.object({
    id: z.string().uuid({ message: CommonErrors.InvalidId }),
    orderId: z.string().uuid({ message: CommonErrors.InvalidId }),
    productId: z.string().uuid({ message: CommonErrors.InvalidId }),
    amount: z.number().gt(0, OrderErrors.AmountGreaterThen),
});

export type CreateOrderItem = z.infer<typeof validator>;

export const HandleCreateOrderItem = async (command: CreateOrderItem) => {
    await validator.parseAsync(command);

    const { id, orderId, productId, amount } = command;

    const order = await orderRepository.getById(orderId);
    order.addItem(id, productId, amount);
    await orderRepository.save(order);
};
