import { ValidationError } from '../../../infrastructure/errors/validation-error';
import ProductErrors from '../constants/errors';
import { z } from 'zod';
import CommonErrors from '../../common/constants/errors';
import postgres from '../../../infrastructure/database/postgres';

const { database } = postgres;

const validator = z.object({
    id: z.string().uuid({ message: CommonErrors.InvalidId }),
    amount: z.number().gte(0, ProductErrors.AmountGreaterThen),
});

export type RestockProduct = z.infer<typeof validator>;

export const HandleRestockProduct = async (command: RestockProduct) => {
    await validator.parseAsync(command);

    const { id, amount } = command;

    const currentProductSql = 'SELECT stock FROM products WHERE id = $1';
    const currentProductParams = [id];
    const currentProduct = await database.oneOrNone<{ stock: number }>(currentProductSql, currentProductParams);

    if (!currentProduct) {
        throw new ValidationError(ProductErrors.NotFound);
    }

    const newStock = currentProduct.stock + amount;

    const updateSql = 'UPDATE products SET stock = $2 WHERE id = $1';
    const updateParams = [id, newStock];
    await database.none(updateSql, updateParams);
};
