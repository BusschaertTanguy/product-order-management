import orderRepository from '../repositories/order-repository';
import { z } from 'zod';
import CommonErrors from '../../common/constants/errors';

const validator = z.object({ id: z.string().uuid({ message: CommonErrors.InvalidId }) });
export type RefuseOrder = z.infer<typeof validator>;

export const HandleRefuseOrder = async (command: RefuseOrder) => {
    await validator.parseAsync(command);

    const order = await orderRepository.getById(command.id);
    order.refuse();
    await orderRepository.save(order);
};
