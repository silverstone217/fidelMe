import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useMemo, useState } from "react";
import { TypeQrCodeType, UserType } from "../../types";
import { useRouter } from "expo-router";
import { usePointsStore, useShopStore } from "../../lib/store";
import { isUserType } from "./AddPointsComponent";
import { sizeText, theme } from "../../utils";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { ButtonComponent } from "../ButtonComponent";
import { addPoint, subtractPoint } from "../../utils/function";
import { storeData } from "../../lib/storage";

type Props = {
  type: TypeQrCodeType;
  DataQrCode: string;
};

const ReadPointComponent = ({ type, DataQrCode }: Props) => {
  const { setUserShops, userShops } = usePointsStore();
  const { shop } = useShopStore();

  const readQRData = JSON.parse(DataQrCode) as UserType;

  const [price, setPrice] = useState("0");
  const [points, setPoints] = useState("0");
  const [isUsdOrFcd, setIsUsdOrFcd] = useState<"usd" | "fcd">("usd");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const myClientUser =
    userShops.length > 0
      ? userShops.find((us) => us.user.id === readQRData.id)
      : null;

  const amountPoints = useMemo(
    () => (shop ? addPoint(Number(price), isUsdOrFcd, shop) : 0),
    [shop, price, isUsdOrFcd]
  );

  const leftPoints = useMemo(
    () => (myClientUser ? myClientUser.points - Number(points) : 0),
    [myClientUser, points]
  );

  const amountPrice = useMemo(
    () =>
      shop && myClientUser
        ? subtractPoint(
            Number(myClientUser.points - amountPoints),
            isUsdOrFcd,
            shop
          )
        : 0,
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

  if (!myClientUser) {
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
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.md,
            color: "dimgray",
          }}
        >{`Le client n'existe pas dans la liste des points. Ajouter le d'abord avant de lire ses points.`}</Text>

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
      </View>
    );
  }

  const handleReadPoints = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const myShopClient = userShops;
      myClientUser.points = leftPoints;
      myClientUser.user.phone = readQRData.phone;

      await storeData("points", myShopClient);
      setUserShops(myShopClient);

      // success message
      setTimeout(
        () => setSuccess(amountPoints - leftPoints + " points retirés"),
        900
      );
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("Une erreur s'est produite lors de la lecture des points");
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
        gap: 25,
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
        Les points du client{" "}
      </Text>

      {myClientUser.points > 0 ? (
        <View style={{ gap: 20, width: "100%" }}>
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              backgroundColor: theme.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              paddingVertical: 20,
              elevation: 5,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 3.84,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.lg,
                color: theme.textBtn,
              }}
            >
              +(243)-{myClientUser.user.phone}
            </Text>
            <Text
              style={{
                fontFamily: "Lato_900Black",
                fontSize: 45,
                color: theme.textBtn,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {myClientUser.points}{" "}
              <Text style={{ fontSize: sizeText.sm }}>points</Text>
            </Text>
          </View>

          {/* price by points */}
          {leftPoints >= 0 ? (
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.md,
                textAlign: "left",
              }}
            >
              Montant de points restants:{" "}
              <Text
                style={{
                  fontFamily: "Lato_700Bold",
                  fontSize: sizeText.md,
                  textAlign: "center",
                }}
              >
                {leftPoints > 0 ? leftPoints : 0}
              </Text>
            </Text>
          ) : (
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
                textAlign: "center",
                color: "red",
              }}
            >
              Pas assez de point de fidelité pour cette somme.
            </Text>
          )}
        </View>
      ) : (
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.md,
            color: "red",
          }}
        >
          Ce client ne possède pas de points de fidelité.
        </Text>
      )}

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
          Nombre de points à utiliser
        </Text>
        <TextInput
          style={styles.input}
          value={points}
          onChangeText={(text) => setPoints(text.replace(/[^0-9]/g, ""))}
          placeholder="ex: 500"
          keyboardType="numeric"
          returnKeyType="done"
        />
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
        title={loading ? "en cours..." : "Utiliser ses points"}
        disabled={
          loading ||
          DataQrCode === "" ||
          leftPoints < 0 ||
          myClientUser.points < 1 ||
          Number(points) < 1
        }
        variant="default"
        onPress={handleReadPoints}
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

export default ReadPointComponent;

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
