import { z } from 'zod';
import CommonErrors from '../../common/constants/errors';
import ProductErrors from '../constants/errors';
import postgres from '../../../infrastructure/database/postgres';

const { database } = postgres;

const validator = z.object({
    id: z.string().uuid({ message: CommonErrors.InvalidId }),
    name: z.string().max(50, ProductErrors.NameMaxLength),
    price: z.number().gte(0, ProductErrors.PriceGreaterThen),
});

export type CreateProduct = z.infer<typeof validator>;

export const HandleCreateProduct = async (command: CreateProduct) => {
    await validator.parseAsync(command);

    const sql = 'INSERT INTO products(id, name, price, stock) VALUES ($1, $2, $3, $4)';
    const params = [command.id, command.name, command.price, 0];
    await database.none(sql, params);
};
