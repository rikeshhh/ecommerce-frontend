export interface FavoritesState {
  favorites: string[];
  loading: boolean;
  error?: string;
  publicUserId: string | null;
  toggleFavorite: (productId: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  initialize: () => Promise<void>;
}
