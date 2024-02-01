import { Admin } from './Admin.ts';

export type Item = {
  id: number;
  name: string;
  vendor: Vendor;
  category: Category;
  stock: number;
  price: number;
  admin: Admin;
  createdAt: string;
}

export type Vendor = {
  id: number;
  name: string;
}

export type Category = {
  id: number;
  name: string;
}

