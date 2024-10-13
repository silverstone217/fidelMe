import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useUserNameStore, useShopStore } from "../../lib/store";
import { CameraView, useCameraPermissions } from "expo-camera";
import { TypeQrCodeType, UserType } from "../../types";
import { ButtonComponent } from "../../components/ButtonComponent";
import { StatusBar } from "expo-status-bar";
import AddPointsComponent, {
  isUserType,
} from "../../components/qrcode/AddPointsComponent";
import ReadPointComponent from "../../components/qrcode/ReadPointComponent";

const { height, width } = Dimensions.get("window");

const ReadQrCodeScreen = () => {
  const { type } = useLocalSearchParams();

  const qrType = type as TypeQrCodeType;

  const { username } = useUserNameStore();
  const { shop } = useShopStore();

  const [DataQrCode, setDataQrCode] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  if (!type) return <Redirect href={"/main"} />;
  if (!username) {
    return <Redirect href={"/"} />;
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          gap: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: 20,
          }}
        >
          Autoriser pour utiliser la caméra afin de scanner le QR Code.
        </Text>
        <ButtonComponent
          onPress={() => {
            requestPermission();
            console.log("clicked!");
          }}
          title="Demander la permission"
          disabled={false}
          variant="default"
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {DataQrCode === "" ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={({ data }) => {
            const readQRData = JSON.parse(data) as UserType;
            if (!isUserType(readQRData)) {
              // Invalid QR Code
              setDataQrCode("");
              // console.log("Invalid QR Code");
              return;
            }
            setDataQrCode(data);
            // console.log(data);
          }}
        />
      ) : (
        <>
          {qrType && qrType === "add" ? (
            <AddPointsComponent type={qrType} DataQrCode={DataQrCode} />
          ) : (
            <ReadPointComponent type={qrType} DataQrCode={DataQrCode} />
          )}
        </>
      )}
      {/* Overlay */}
      {!DataQrCode && (
        <View style={styles.overlay}>
          <View style={styles.guide} />
        </View>
      )}
      {!qrType && <StatusBar hidden />}
    </SafeAreaView>
  );
};

export default ReadQrCodeScreen;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  guide: {
    width: width * 0.8, // Width of the guide rectangle
    height: width * 0.8, // Height of the guide rectangle
    borderWidth: 2,
    borderColor: "white", // Color of the border
    borderRadius: 10, // Rounded corners
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
