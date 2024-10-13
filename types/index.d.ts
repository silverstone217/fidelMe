export interface ShopType {
  id: string;
  name: string;
  address: string;
  usd: number;
  fcd: number;
  pointUsd: number;
  pointFcd: number;
}

export type userNameType = string | null | undefined;

export interface UserType {
  id: string;
  phone: string;
}

export type TypeQrCodeType = "add" | "retrieve";

export interface PointStoreShop {
  user: UserType;
  points: number;
}
