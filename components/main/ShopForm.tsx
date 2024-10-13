import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { sizeText, theme } from "../../utils";
import uuid from "react-native-uuid";
import { ButtonComponent } from "../ButtonComponent";
import { isEmptyString } from "../../utils/function";
import { StatusBar } from "expo-status-bar";
import { storeData } from "../../lib/storage";
import { useShopStore } from "../../lib/store";
import { ShopType } from "../../types";

const ShopForm = () => {
  const { shop, setShop } = useShopStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [usdPoints, setUsdPoints] = useState("0");
  const [fcdPoints, setFcdPoints] = useState("0");
  const [pointsToUsd, setPointsToUsd] = useState("0");
  const [pointsToFcd, setPointsToFcd] = useState("0");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (
      isEmptyString(name) ||
      isEmptyString(address) ||
      isEmptyString(fcdPoints) ||
      isEmptyString(usdPoints) ||
      isEmptyString(pointsToUsd) ||
      isEmptyString(pointsToFcd)
    ) {
      setError("Tous les champs ayant * sont obligatoires");
      return;
    }

    // if (isEmptyString(usdPoints) && isEmptyString(fcdPoints)) {
    //   setError("Veuillez entrer le nombre de points en FC ou en USD");
    //   return;
    // }

    setError("");
    setLoading(true);
    setSuccess("");

    try {
      const uid =
        uuid.v4().toString() +
        "-" +
        address.trim().replace(/ /g, "-").toLowerCase();
      console.log({ uid });

      const shopData: ShopType = {
        id: uid,
        name: name.trim(),
        address: address.trim().toLowerCase(),
        fcd: fcdPoints ? Number(fcdPoints) : 0,
        usd: usdPoints ? Number(usdPoints) : 0,
        pointUsd: pointsToUsd ? Number(pointsToUsd) : 0,
        pointFcd: pointsToFcd ? Number(pointsToFcd) : 0,
      };

      const saveShop = await storeData("shop", shopData);
      console.log("shop saved!");

      setTimeout(() => {
        setSuccess("Votre magasin a été enregistré avec succès!");
        setName("");
        setAddress("");
        setFcdPoints("");
        setUsdPoints("");
        setShop(shopData);
      }, 1500);
    } catch (error) {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          gap: 5,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Lato_700Bold",
            fontSize: sizeText.lg,
          }}
        >
          Ajouter votre magasin
        </Text>
        <Text
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.sm,
            color: "dimgray",
          }}
        >
          Tous les champs sont obligatoires, remplisser avant de cliquer sur le
          bouton.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom du magasin *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="ex: Chez maman mapasa"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresse du magasin *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="N* Avenue commune"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>

      {/* conversion */}
      <View
        style={{
          width: "100%",
          gap: 5,
        }}
      >
        <Text style={styles.label}>Conversion en Points</Text>
        {/* usd */}
        <View
          style={{
            width: "100%",
            gap: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* usd to points */}
          <View
            style={{
              width: "45%",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
                textAlign: "left",
              }}
            >
              Montant en $(usd)
            </Text>
            <TextInput
              style={styles.input}
              value={usdPoints}
              onChangeText={(text) => setUsdPoints(text.replace(/[^0-9]/g, ""))}
              placeholder="ex: 50"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          {/*points to usd */}
          <View
            style={{
              width: "45%",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
              }}
            >
              Nombre de points
            </Text>
            <TextInput
              style={styles.input}
              value={pointsToUsd}
              onChangeText={(text) =>
                setPointsToUsd(text.replace(/[^0-9]/g, ""))
              }
              placeholder="ex: 10"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* fcd */}
        <View
          style={{
            width: "100%",
            gap: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          {/* fcd to points */}
          <View
            style={{
              width: "45%",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
                textAlign: "left",
              }}
            >
              Montant en FC
            </Text>
            <TextInput
              style={styles.input}
              value={fcdPoints}
              onChangeText={(text) => setFcdPoints(text.replace(/[^0-9]/g, ""))}
              placeholder="ex: 1000"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          {/* points to fcd */}
          <View
            style={{
              width: "45%",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato_400Regular",
                fontSize: sizeText.sm,
              }}
            >
              Nombre de points
            </Text>
            <TextInput
              style={styles.input}
              value={pointsToFcd}
              onChangeText={(text) =>
                setPointsToFcd(text.replace(/[^0-9]/g, ""))
              }
              placeholder="ex: 500"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      {/* error and success message */}
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <ButtonComponent
        title={loading ? "en cours..." : "Enregistrer"}
        variant="default"
        disabled={isEmptyString(name) || isEmptyString(address) || loading}
        onPress={handleSubmit}
      />

      <Text
        style={{
          marginTop: 5,
          fontFamily: "Lato_400Regular",
          fontSize: sizeText.sm,
          color: "dimgray",
        }}
      >
        Laisser à 0 si vous ne voulez pas utiliser une devise specifique.{" "}
      </Text>

      <StatusBar style="dark" />
    </View>
  );
};

export default ShopForm;

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
