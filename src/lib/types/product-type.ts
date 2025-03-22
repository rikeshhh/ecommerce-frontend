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

export interface Category {
  name: string;
  slug: string;
  image: string;
}

export interface ProductState {
  products: Product[];
  categories: Category[];
  totalProducts: number;
  recommendations: Product[];
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  error?: string;
  selectedProduct: Product | null;
  fetchProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    exclude?: string;
    from?: string;
    to?: string;
  }) => Promise<{
    items: Product[];
    totalItems: number;
    totalPages: number;
  }>;
  fetchProductById: (id: string) => Promise<void>;
  fetchRecommendations: (userId: string) => Promise<void>;
  addProduct: (data: FormData) => Promise<Product>;
  fetchCategories: () => Promise<Category[]>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}
