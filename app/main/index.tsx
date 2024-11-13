import { ScrollView, StyleSheet, Text } from "react-native";
import React from "react";
import { sizeText, theme } from "../../utils";
import { Redirect } from "expo-router";
import { useShopStore, useUserNameStore } from "../../lib/store";
import { StatusBar } from "expo-status-bar";
import MainComponent from "../../components/main/MainComponent";
import ShopForm from "../../components/main/ShopForm";

const MainScreen = () => {
  const { username } = useUserNameStore();
  const { shop } = useShopStore();
  // const { user, setUser } = useUserStore();

  if (!username) {
    return <Redirect href={"/"} />;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: theme.background,
        position: "relative",
      }}
    >
      {shop ? <MainComponent /> : <ShopForm />}
      {shop && (
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.xs,
            color: theme.text,
            position: "absolute",
            bottom: 20,
            right: 20,
            left: 20,
            textAlign: "center",
          }}
        >
          Servi group inc 2024
        </Text>
      )}
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default MainScreen;
