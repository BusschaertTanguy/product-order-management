export interface OrderItemPrimitives {
    readonly id: string;
    readonly orderId: string;
    readonly productId: string;
    readonly amount: number;
}

export class OrderItem {
    public constructor(
        public readonly id: string,
        public readonly orderId: string,
        public readonly productId: string,
        public readonly amount: number,
    ) {}

    public ChangeAmount(newAmount: number) {
        return new OrderItem(this.id, this.orderId, this.productId, newAmount);
    }
}
