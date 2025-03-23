import axios from "axios";
import { Product, Category } from "@/lib/types/product-type";

export const fetchProducts = async ({
  page = 1,
  limit = 10,
  search,
  from,
  to,
  category,
  exclude,
}: {
  page?: number;
  limit?: number;
  search?: string;
  from?: string;
  to?: string;
  category?: string;
  exclude?: string;
} = {}) => {
  const safePage = Math.max(1, parseInt(String(page), 10) || 1);
  const safeLimit = Math.max(1, parseInt(String(limit), 10) || 10);

  const params = {
    page: safePage,
    limit: safeLimit,
    search: search?.trim() || undefined,
    from: from || undefined,
    to: to || undefined,
    category: category || undefined,
    exclude: exclude || undefined,
  };

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    { params }
  );

  const {
    products: rawProducts,
    totalProducts,
    currentPage,
    totalPages,
    limit: responseLimit,
  } = response.data;

  const products = rawProducts.map((product: Product) => ({
    ...product,
    createdAt: product.createdAt || new Date().toISOString(),
  }));

  if (search && search.trim()) {
    try {
      const token = localStorage.getItem("authToken");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/search-history`,
        { query: search.trim() },
        config
      );
    } catch (logError) {
      console.error("Failed to log search (non-critical):", logError);
    }
  }

  return {
    items: products,
    totalItems: totalProducts,
    totalPages,
    currentPage,
    limit: responseLimit,
  };
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
  );
  const product = response.data.product;
  if (!product) throw new Error("Product not found in response");
  return {
    ...product,
    createdAt: product.createdAt || new Date().toISOString(),
  };
};

export const fetchProductsByIds = async (ids: string[]): Promise<Product[]> => {
  try {
    const response = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
          );
          return res.data.product as Product;
        } catch (error) {
          console.error(`Product ${id} fetch failed:`, error);
          return null;
        }
      })
    );
    return response.filter((p): p is Product => p !== null); 
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch products by IDs"
    );
  }
};

export const fetchRecommendations = async (userId: string) => {
  const params = userId ? { userId } : {};
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/recommendations`,
    {
      params,
    }
  );
  return response.data.recommendations || [];
};

export const addProduct = async (data: FormData) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Authentication required");

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  if (decodedToken.exp * 1000 < Date.now()) throw new Error("Token expired");

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const newProduct = response.data.product;
  return {
    ...newProduct,
    createdAt: newProduct.createdAt || new Date().toISOString(),
  };
};

export const fetchCategories = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    {
      params: { page: 1, limit: 100 },
    }
  );

  const products = response.data.products || [];
  return Array.from(new Set(products.map((p: Product) => p.category)))
    .filter((category): category is string => !!category)
    .map((category) => {
      const firstProduct = products.find(
        (p: Product) => p.category === category
      );
      return {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        image: firstProduct?.image || "/placeholder.png",
      };
    });
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    }
  );
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
  return id;
};
