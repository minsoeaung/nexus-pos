export type Item = {
  id: number;
  name: string;
  vendor: Vendor;
  category: Category;
  stock: number;
  price: number;
  createdBy: {
    id: number;
    userName: string;
    email: string;
    suspend: boolean;
  };
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

