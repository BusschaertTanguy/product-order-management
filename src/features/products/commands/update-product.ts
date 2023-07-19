import { ValidationError } from '../../../infrastructure/errors/validation-error';
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

export type UpdateProduct = z.infer<typeof validator>;

export const HandleUpdateProduct = async (command: UpdateProduct) => {
    await validator.parseAsync(command);

    const { id, name, price } = command;

    const existsSql = 'SELECT 1 FROM products WHERE id = $1';
    const existsParams = [id];
    const exists = (await database.oneOrNone<number>(existsSql, existsParams)) !== null;

    if (!exists) {
        throw new ValidationError(ProductErrors.NotFound);
    }

    const updateSql = 'UPDATE products SET name = $2, price = $3 WHERE id = $1';
    const updateParams = [id, name, price];
    await database.none(updateSql, updateParams);
};
