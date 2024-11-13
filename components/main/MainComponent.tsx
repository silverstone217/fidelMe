import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { sizeText, theme } from "../../utils";
import {
  useUserNameStore,
  useShopStore,
  usePointsStore,
} from "../../lib/store";
import Icon from "react-native-vector-icons/Ionicons";
import { ButtonComponent } from "../ButtonComponent";
import ModalComponent from "../ModalComponent";
import PointsForm from "./PointsForm";
import { removeData } from "../../lib/storage";
import { useCameraPermissions } from "expo-camera";
import { TypeQrCodeType } from "../../types";
import { useRouter } from "expo-router";

const MainComponent = () => {
  const { username } = useUserNameStore();
  const { shop, setShop } = useShopStore();
  const { setUserShops, userShops } = usePointsStore();

  const [loading, setLoading] = useState(false);
  const [loadingRead, setLoadingRead] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = useMemo(
    () => Boolean(permission?.granted),
    [permission?.granted]
  );

  const [isVisible, setIsVisible] = useState(false);

  const deleteShop = async () => {
    try {
      setError("");
      setSuccess("");

      // Afficher un dialogue de confirmation
      Alert.alert(
        "Confirmation",
        "Voulez-vous vraiment supprimer cette boutique? Vos données risqueront d'être perdues.",
        [
          {
            text: "Annuler",
            onPress: () => console.log("Suppression annulée"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await removeData("shop");
              await removeData("points");

              setShop(null);
              setUserShops([]);
              setSuccess("Votre magasin a été supprimé avec succès!");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      setError("Une erreur s'est produite lors de la suppression du magasin");
    } finally {
      setLoading(false);
      setIsVisible(false);
    }
  };

  const scanQrCode = async (
    type: TypeQrCodeType,
    setValue: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setValue(true);
    try {
      // Request permission if not already granted
      if (!isPermissionGranted) {
        await requestPermission();
      }

      // Navigate to the QR code screen after a brief delay
      setTimeout(() => {
        router.navigate(`/qrcode/${type}`);
      }, 600);
    } catch (error) {
      console.log(error);
      Alert.alert("Erreur survenue", "Impossible d'effectuer cette action");
    } finally {
      setTimeout(() => setValue(false), 900);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top */}
      <View style={{ width: "100%" }}>
        <Text
          style={{
            fontFamily: "Lato_700Bold",
            fontSize: sizeText.xl,
            color: theme.text,
          }}
        >
          Bienvenue, {username}
        </Text>
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,
            color: "dimgray",
          }}
        >
          Votre magasin est ouvert!
        </Text>
        {/* buttons */}
      </View>

      {/* main */}
      <View
        style={{
          width: "100%",
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 40,
          backgroundColor: theme.primary,
          position: "relative",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {/* name */}
        <Text
          style={{
            fontFamily: "Lato_700Bold",
            fontSize: sizeText.lg,
            color: theme.textBtn,
            textTransform: "capitalize",
          }}
          numberOfLines={1}
        >
          {shop?.name}
        </Text>

        {/* address */}
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,
            color: "lightgray",
          }}
          numberOfLines={1}
        >
          Adresse: {shop?.address}
        </Text>

        {/* conversion */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
          }}
        >
          {shop?.usd ? (
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
                color: "lightgray",
              }}
            >
              {shop?.usd} $ USD : {shop?.pointUsd} points.
            </Text>
          ) : null}
          {shop?.fcd ? (
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
                color: "lightgray",
              }}
            >
              {shop?.fcd} FC : {shop?.pointFcd} points.
            </Text>
          ) : null}
        </View>

        {/* absolute button */}
        <View
          style={{
            position: "absolute",
            bottom: 5,
            right: 10,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Pressable onPress={() => setIsVisible(true)}>
            <Icon name="create-outline" size={25} color="white" />
          </Pressable>
          <Pressable onPress={deleteShop}>
            <Icon name="trash-outline" size={25} color="tomato" />
          </Pressable>
        </View>
      </View>

      {/* actions */}
      <View
        style={{
          gap: 10,
          width: "100%",
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_700Bold",
            fontSize: sizeText.md,
            color: theme.text,
          }}
        >
          Mes actions
        </Text>
        {/* actions buttons */}
        <ButtonComponent
          title="Ajouter des points"
          variant="default"
          disabled={loading}
          onPress={() => scanQrCode("add", setLoading)}
        />
        <ButtonComponent
          title="Lire des points"
          variant="outline"
          disabled={loadingRead}
          onPress={() => scanQrCode("retrieve", setLoadingRead)}
        />
      </View>

      {/* bottom */}
      {/* Modify points conversions */}
      <ModalComponent
        isOpen={isVisible}
        onClose={() => setIsVisible(false)}
        title="Conversion en Points"
      >
        <PointsForm onClose={() => setIsVisible(false)} />
      </ModalComponent>
    </View>
  );
};

export default MainComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
});
