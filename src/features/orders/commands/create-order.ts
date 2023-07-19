import { Order } from '../entities/order';
import orderRepository from '../repositories/order-repository';
import { z } from 'zod';
import OrderErrors from '../constants/errors';
import CommonErrors from '../../common/constants/errors';

const validator = z.object({
    id: z.string().uuid({ message: CommonErrors.InvalidId }),
    name: z.string().max(50, OrderErrors.NameMaxLength),
});

export type CreateOrder = z.infer<typeof validator>;

export const HandleCreateOrder = async (command: CreateOrder) => {
    await validator.parseAsync(command);

    const order = Order.create(command.id, command.name);
    await orderRepository.save(order);
};
