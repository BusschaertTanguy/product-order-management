import { NextFunction, Request, Response } from 'express';
import { GetProducts, GetProductsResult, HandleGetProducts } from '../queries/get-products';
import { CreateProduct, HandleCreateProduct } from '../commands/create-product';
import { HandleUpdateProduct, UpdateProduct } from '../commands/update-product';
import { HandleRestockProduct, RestockProduct } from '../commands/restock-product';

const getProducts = async (req: Request<unknown, GetProductsResult[], unknown, GetProducts>, res: Response, next: NextFunction) => {
    try {
        const result = await HandleGetProducts(req.query);
        res.status(200).send(result);
    } catch (err) {
        await next(err);
    }
};

const createProduct = async (req: Request<unknown, unknown, CreateProduct>, res: Response, next: NextFunction) => {
    try {
        await HandleCreateProduct(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const updateProduct = async (req: Request<unknown, unknown, UpdateProduct>, res: Response, next: NextFunction) => {
    try {
        await HandleUpdateProduct(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const restockProduct = async (req: Request<unknown, unknown, RestockProduct>, res: Response, next: NextFunction) => {
    try {
        await HandleRestockProduct(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const productController = {
    getProducts,
    createProduct,
    updateProduct,
    restockProduct,
};

export default productController;
