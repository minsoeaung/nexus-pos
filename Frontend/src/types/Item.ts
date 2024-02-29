export type Item = {
  id: number;
  name: string;
  vendor: NamedApiResource;
  category: NamedApiResource;
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

export type NamedApiResource = {
  id: number;
  name: string;
}

