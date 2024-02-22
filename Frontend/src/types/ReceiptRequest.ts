export interface ReceiptRequest {
  customerId: number;
  name: string;
  phoneNumber: string;
  address: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  itemId: number;
  quantity: number;
}