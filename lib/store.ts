import { create } from "zustand";
import { PointStoreShop, ShopType, userNameType } from "../types";

// username
interface userNameStore {
  username: userNameType;
  setUsername: (username: userNameType) => void;
}

export const useUserNameStore = create<userNameStore>((set) => ({
  username: null,
  setUsername: (username: userNameType) => set({ username }),
}));

// shop
interface shopStore {
  shop: ShopType | null;
  setShop: (shop: ShopType | null) => void;
}

export const useShopStore = create<shopStore>((set) => ({
  shop: null,
  setShop: (shop: ShopType | null) => set({ shop }),
}));

interface pointsStore {
  userShops: PointStoreShop[];
  setUserShops: (userShop: PointStoreShop[]) => void;
}

export const usePointsStore = create<pointsStore>((set) => ({
  userShops: [],
  setUserShops: (userShop: PointStoreShop[]) =>
    set({ userShops: [...userShop] }),
}));
