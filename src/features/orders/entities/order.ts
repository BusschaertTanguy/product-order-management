import { OrderStatus } from '../enums/order-status';
import { OrderItem, OrderItemPrimitives } from './order-item';
import { ValidationError } from '../../../infrastructure/errors/validation-error';
import OrderErrors from '../constants/errors';

export interface OrderPrimitives {
    readonly id: string;
    readonly name: string;
    readonly status: OrderStatus;
    readonly items: OrderItemPrimitives[];
}

export class Order {
    public readonly id: string;
    private readonly name: string;
    private status: OrderStatus;
    private items: OrderItem[];

    private constructor(id: string, name: string, status: OrderStatus) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.items = [];
    }

    public static create(id: string, name: string) {
        return new Order(id, name, OrderStatus.Pending);
    }

    public static fromPrimitives(primitives: OrderPrimitives) {
        const { id, name, status, items } = primitives;

        const order = new Order(id, name, status);
        order.items = items.map((i) => new OrderItem(i.id, i.orderId, i.productId, i.amount));
        return order;
    }

    public toPrimitives() {
        const primitives: OrderPrimitives = {
            id: this.id,
            name: this.name,
            status: this.status,
            items: this.items.map((i) => {
                const item: OrderItemPrimitives = { ...i };
                return item;
            }),
        };

        return primitives;
    }

    public addItem(id: string, productId: string, amount: number) {
        this.checkOrderStatus();

        const productAlreadyAdded = this.items.some((i) => i.productId === productId);

        if (productAlreadyAdded) {
            throw new ValidationError(OrderErrors.ProductAlreadyAdded);
        }

        const item = new OrderItem(id, this.id, productId, amount);
        this.items.push(item);
    }

    public updateAmount(id: string, amount: number) {
        this.checkOrderStatus();

        const item = this.items.find((i) => i.id === id);

        if (!item) {
            throw new ValidationError(OrderErrors.NotFound);
        }

        this.items[this.items.indexOf(item)] = item.ChangeAmount(amount);
    }

    public removeItem(id: string) {
        this.checkOrderStatus();

        const item = this.items.find((i) => i.id === id);

        if (!item) {
            throw new ValidationError(OrderErrors.NotFound);
        }

        this.items = this.items.filter((i) => i.id !== id);
    }

    public accept() {
        this.checkOrderStatus();

        this.status = OrderStatus.Accepted;
    }

    public refuse() {
        this.checkOrderStatus();

        this.status = OrderStatus.Refused;
    }

    public getItem(productId: string) {
        const item = this.items.find((i) => i.productId === productId);

        if (!item) {
            throw new ValidationError(OrderErrors.ProductMismatch);
        }

        return item;
    }

    private checkOrderStatus() {
        if (this.status !== OrderStatus.Pending) {
            throw new ValidationError(OrderErrors.AlreadyClosed);
        }
    }
}
