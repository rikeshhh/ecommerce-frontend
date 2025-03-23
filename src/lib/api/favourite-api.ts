import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface FavoriteResponse {
  favorites: string[]; 
}

export const fetchFavorites = async (userId?: string): Promise<string[]> => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.get(`${API_URL}/api/favorites`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: userId ? { userId } : undefined,
    });
    return response.data.favorites.map((p: { _id: string }) => p._id);
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch favorites"
    );
  }
};

export const addFavorite = async (
  productId: string,
  userId?: string
): Promise<string[]> => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.post(
      `${API_URL}/api/favorites`,
      { productId, userId },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return response.data.favorites;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to add favorite"
    );
  }
};

export const removeFavorite = async (
  productId: string,
  userId?: string
): Promise<string[]> => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await axios.delete(
      `${API_URL}/api/favorites/${productId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        data: userId ? { userId } : undefined,
      }
    );
    return response.data.favorites;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to remove favorite"
    );
  }
};
