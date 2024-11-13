import React from "react";
import { router, Stack } from "expo-router";
import {
  Lato_100Thin,
  Lato_300Light,
  Lato_400Regular,
  Lato_700Bold,
  Lato_900Black,
  useFonts,
} from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { getData } from "../lib/storage";
import { usePointsStore, useShopStore, useUserNameStore } from "../lib/store";
import { PointStoreShop, ShopType, UserType } from "../types";
import { StatusBar } from "expo-status-bar";
import { Linking } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded, error] = useFonts({
    Lato_100Thin,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });

  const { username, setUsername } = useUserNameStore();
  const { shop, setShop } = useShopStore();
  const { setUserShops, userShops } = usePointsStore();

  // get username
  useEffect(() => {
    const getName = async () => {
      const myName = await getData("username");
      if (myName) {
        setUsername(myName);
      } else {
        setUsername(null);
      }
    };
    getName();
  }, []);

  // get shop
  useEffect(() => {
    const getShopData = async () => {
      const myShop = (await getData("shop")) as ShopType | null;
      if (myShop) {
        setShop(myShop);
      } else {
        setShop(null);
      }
    };
    getShopData();
  }, []);

  // get user shops
  useEffect(() => {
    const getUserShopsData = async () => {
      const myUserShops = (await getData("points")) as PointStoreShop[];
      if (myUserShops) {
        setUserShops(myUserShops);
      } else {
        setUserShops([]);
      }
    };
    getUserShopsData();
  }, []);

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      // Handle the URL and navigate accordingly
      const myRoute = url.replace(/.*?:\/\//g, ""); // Get the path after the scheme // Navigate to the corresponding screen
      router.push(`/${myRoute}`);
    };
    const linkingListener = Linking.addEventListener("url", ({ url }) =>
      handleDeepLink(url)
    );
    return () => {
      linkingListener.remove();
    };
  }, []);

  // font loader
  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 4000);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </>
  );
}
