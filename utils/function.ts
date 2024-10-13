import { ShopType } from "../types";

export const isEmptyString = (str: string) => {
  return str.replace(/ /g, "") === "";
};

export const addPoint = (
  price: number,
  currency: "usd" | "fcd",
  shop: ShopType
) => {
  if (currency === "usd") {
    const totalPoints = Math.round((price * shop.pointUsd) / shop.usd);
    return totalPoints;
  } else {
    const totalPoints = Math.round((price * shop.pointFcd) / shop.fcd);
    return totalPoints;
  }
};

export const subtractPoint = (
  points: number,
  currency: "usd" | "fcd",
  shop: ShopType
): number => {
  if (currency === "usd") {
    const totalPoints = Math.round((points * shop.usd) / shop.pointUsd);
    return totalPoints;
  } else {
    const totalPoints = Math.round((points * shop.fcd) / shop.pointFcd);
    return totalPoints;
  }
};
