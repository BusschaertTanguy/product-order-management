import { z } from 'zod';
import CommonErrors from '../../common/constants/errors';
import orderRepository from '../repositories/order-repository';

const validator = z.object({
    id: z.string().uuid({ message: CommonErrors.InvalidId }),
    orderId: z.string().uuid({ message: CommonErrors.InvalidId }),
});

export type RemoveOrderItem = z.infer<typeof validator>;

export const HandleRemoveOrderItem = async (command: RemoveOrderItem) => {
    await validator.parseAsync(command);

    const { id, orderId } = command;

    const order = await orderRepository.getById(orderId);
    order.removeItem(id);
    await orderRepository.save(order);
};
