import { NextFunction, Request, Response } from 'express';
import { GetOrders, GetOrdersResult, HandleGetOrders } from '../queries/get-orders';
import { GetOrder, GetOrderResult, HandleGetOrder } from '../queries/get-order';
import { CreateOrder, HandleCreateOrder } from '../commands/create-order';
import { HandleRemoveOrderItem, RemoveOrderItem } from '../commands/remove-order-item';
import { AcceptOrder, HandleAcceptOrder } from '../commands/accept-order';
import { HandleRefuseOrder, RefuseOrder } from '../commands/refuse-order';
import { CreateOrderItem, HandleCreateOrderItem } from '../commands/create-order-item';
import { HandleUpdateOrderItemAmount, UpdateOrderItemAmount } from '../commands/update-order-item-amount';

const getOrders = async (req: Request<unknown, GetOrdersResult[], unknown, GetOrders>, res: Response, next: NextFunction) => {
    try {
        const result = await HandleGetOrders(req.query);
        res.status(200).send(result);
    } catch (err) {
        await next(err);
    }
};

const getOrder = async (req: Request<GetOrder, GetOrderResult | null, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
        const result = await HandleGetOrder(req.params);
        res.status(200).send(result);
    } catch (err) {
        await next(err);
    }
};

const createOrder = async (req: Request<unknown, unknown, CreateOrder>, res: Response, next: NextFunction) => {
    try {
        await HandleCreateOrder(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const removeOrderItem = async (req: Request<RemoveOrderItem, unknown, unknown>, res: Response, next: NextFunction) => {
    try {
        await HandleRemoveOrderItem(req.params);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const acceptOrder = async (req: Request<unknown, unknown, AcceptOrder>, res: Response, next: NextFunction) => {
    try {
        await HandleAcceptOrder(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const refuseOrder = async (req: Request<unknown, unknown, RefuseOrder>, res: Response, next: NextFunction) => {
    try {
        await HandleRefuseOrder(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const createOrderItem = async (req: Request<unknown, unknown, CreateOrderItem>, res: Response, next: NextFunction) => {
    try {
        await HandleCreateOrderItem(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const updateOrderItemAmount = async (req: Request<unknown, unknown, UpdateOrderItemAmount>, res: Response, next: NextFunction) => {
    try {
        await HandleUpdateOrderItemAmount(req.body);
        res.sendStatus(204);
    } catch (err) {
        await next(err);
    }
};

const orderController = {
    getOrders,
    getOrder,
    createOrder,
    removeOrderItem,
    acceptOrder,
    refuseOrder,
    createOrderItem,
    updateOrderItemAmount,
};

export default orderController;
