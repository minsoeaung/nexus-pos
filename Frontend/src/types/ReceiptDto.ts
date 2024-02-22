import { Item } from './Item.ts';

export type Receipt = {
  id: number;
  customer: Customer | null;
  createdAt: string;
  receiptItems: ReceiptItem[];
}

export type Customer = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}

export type ReceiptItem = {
  id: number;
  receiptId: number;
  price: number;
  quantity: number;
  itemId: number | null;
  item: Omit<Item, 'createdBy'> | null;
}

