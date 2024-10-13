import AsyncStorage from "@react-native-async-storage/async-storage";
import { PointStoreShop, ShopType, UserType } from "../types";

export const storeData = async (
  key: string,
  value: string | ShopType | UserType | PointStoreShop[]
) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error storing data", e);
    return null;
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (e) {
    console.error("Error retrieving data", e);
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error("Error removing data", e);
  }
};
