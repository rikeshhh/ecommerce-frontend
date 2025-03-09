export interface Product {
  _id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}
