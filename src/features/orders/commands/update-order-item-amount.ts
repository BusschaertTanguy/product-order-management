import { z } from 'zod';
import CommonErrors from '../../common/constants/errors';
import OrderErrors from '../constants/errors';
import orderRepository from '../repositories/order-repository';

const validator = z.object({
    id: z.string().uuid({ message: CommonErrors.InvalidId }),
    orderId: z.string().uuid({ message: CommonErrors.InvalidId }),
    amount: z.number().gt(0, OrderErrors.AmountGreaterThen),
});

export type UpdateOrderItemAmount = z.infer<typeof validator>;

export const HandleUpdateOrderItemAmount = async (command: UpdateOrderItemAmount) => {
    await validator.parseAsync(command);

    const { id, orderId, amount } = command;

    const order = await orderRepository.getById(orderId);
    order.updateAmount(id, amount);
    await orderRepository.save(order);
};
