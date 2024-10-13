import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { PointStoreShop, TypeQrCodeType, UserType } from "../../types";
import { usePointsStore, useShopStore } from "../../lib/store";
import { sizeText, theme } from "../../utils";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { ButtonComponent } from "../ButtonComponent";
import { addPoint, isEmptyString } from "../../utils/function";
import { useRouter } from "expo-router";
import { storeData } from "../../lib/storage";

type Props = {
  type: TypeQrCodeType;
  DataQrCode: string;
};

const AddPointsComponent = ({ type, DataQrCode }: Props) => {
  const { setUserShops, userShops } = usePointsStore();
  const { shop } = useShopStore();

  const readQRData = JSON.parse(DataQrCode) as UserType;

  const [price, setPrice] = useState("0");
  const [isUsdOrFcd, setIsUsdOrFcd] = useState<"usd" | "fcd">("usd");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const amountPoints = useMemo(
    () => (shop ? addPoint(Number(price), isUsdOrFcd, shop) : 0),
    [shop, price, isUsdOrFcd]
  );

  if (!isUserType(readQRData)) {
    return (
      <Text
        style={{
          fontFamily: "Lato_400Regular",
          fontSize: 20,
          margin: "auto",
        }}
      >
        Invalid QR Code.
      </Text>
    );
  }

  const myClientUser =
    userShops.length > 0
      ? userShops.find((us) => us.user.id === readQRData.id)
      : null;

  //   add points to the list of points
  const handleAddPoints = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const myShopClient = userShops;

    try {
      if (!myClientUser) {
        const userFormData: UserType = {
          id: readQRData.id,
          phone: readQRData.phone,
        };

        const formData: PointStoreShop = {
          user: userFormData,
          points: amountPoints,
        };
        myShopClient.push(formData);
        setUserShops(myShopClient);
        await storeData("points", myShopClient);
      } else {
        myClientUser.points += amountPoints;
        myClientUser.user.phone = readQRData.phone;
        setUserShops(myShopClient);
        await storeData("points", myShopClient);
      }

      // success message
      setTimeout(() => setSuccess(amountPoints + " points ajoutés"), 900);
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Une erreur s'est produite lors de l'ajout des points");
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 20,
        width: "100%",
      }}
    >
      <Text
        style={{
          fontSize: sizeText.xxl,
          // textDecorationLine: "underline",
          marginBottom: 15,
          fontFamily: "Lato_900Black",
        }}
      >
        Transaction en cours{" "}
      </Text>

      {/* Read price to add points */}
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,
            width: "100%",
            textAlign: "left",
          }}
        >
          Montant depensé par le client
        </Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
          placeholder="ex: 500"
          keyboardType="numeric"
          returnKeyType="done"
        />
      </View>

      {/* currency */}
      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,

            textAlign: "left",
          }}
        >
          Devise du montant
        </Text>

        {/* usd */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato_400Regular",
              fontSize: sizeText.sm,
              color: "darkgray",
            }}
          >
            USD
          </Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setIsUsdOrFcd("usd");
            }}
            style={{
              width: 25,
              height: 25,
              backgroundColor: isUsdOrFcd === "usd" ? theme.primary : "white",
              borderRadius: 12.5,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "darkgray",
            }}
          />
        </View>

        {/* fcd */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontFamily: "Lato_400Regular",
              fontSize: sizeText.sm,
              color: "darkgray",
            }}
          >
            FC
          </Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setIsUsdOrFcd("fcd");
            }}
            style={{
              width: 25,
              height: 25,
              backgroundColor: isUsdOrFcd === "fcd" ? theme.primary : "white",
              borderRadius: 12.5,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 3,
              borderColor: "darkgray",
            }}
          />
        </View>
      </View>

      {/* amounts points */}
      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,
            textAlign: "left",
          }}
        >
          Montant de points ajoutés
        </Text>
        <Text
          style={{
            fontFamily: "Lato_700Bold",
            fontSize: sizeText.md,
            color: theme.text,
            textAlign: "center",
          }}
        >
          {amountPoints}
        </Text>
      </View>

      {/* error or success */}
      {error && (
        <Text style={styles.error} numberOfLines={1} ellipsizeMode="middle">
          {error}
        </Text>
      )}
      {success && (
        <Text style={styles.success} numberOfLines={1} ellipsizeMode="middle">
          {success}
        </Text>
      )}

      <ButtonComponent
        title={loading ? "en cours..." : "Ajouter des points"}
        disabled={loading || DataQrCode === "" || isEmptyString(price)}
        variant="default"
        onPress={handleAddPoints}
      />

      <Pressable
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          alignContent: "center",
          paddingVertical: 10,
        }}
        onPress={() => {
          Haptics.selectionAsync();
          router.back();
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,
            color: theme.text,
            textAlign: "center",
          }}
        >
          Retour
        </Text>
      </Pressable>

      {/* {myClientUser && <Text>{myClientUser.points} points</Text>} */}

      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    gap: 5,
  },
  label: {
    fontFamily: "Lato_400Regular",
    fontSize: sizeText.md,
  },
  input: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "dimGray",
    borderRadius: 10,
    fontFamily: "Lato_400Regular",
  },
  uid: {
    width: "100%",
    flexWrap: "wrap",
    fontFamily: "Lato_400Regular",
  },
  error: {
    fontFamily: "Lato_400Regular",
    fontSize: sizeText.xs,
    color: theme.error,
  },
  success: {
    fontFamily: "Lato_400Regular",
    fontSize: sizeText.xs,
    color: theme.success,
  },
});

export default AddPointsComponent;

export function isUserType(data: any): data is UserType {
  // Add your type checking logic here
  // For example, check if the data has the required properties and types
  return typeof data.id === "string" && typeof data.phone === "string";
}
