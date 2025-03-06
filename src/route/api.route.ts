export const publicRoutes = {
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
  },
  products: {
    getAll: "/api/products",
    getById: (id: string) => `/api/products/${id}`,
  },
};

export const privateRoutes = {
  auth: {
    logout: "/api/auth/logout",
    getMe: "/api/auth/me",
  },
  products: {
    create: "/api/products",
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
  },
  orders: {
    create: "/api/orders",
    getById: (id: string) => `/api/orders/${id}`,
    getUserOrders: (userId: string) => `/api/orders/user/${userId}`,
  },
  cart: {
    addItem: "/api/cart",
    getItems: "/api/cart",
    removeItem: (id: string) => `/api/cart/${id}`,
  },
};

export const apiRoutes = {
  public: publicRoutes,
  private: privateRoutes,
};
