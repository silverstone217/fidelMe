import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useShopStore } from "../../lib/store";
import { sizeText, theme } from "../../utils";
import { ButtonComponent } from "../ButtonComponent";
import { isEmptyString } from "../../utils/function";
import { storeData } from "../../lib/storage";
import { ShopType } from "../../types";

type Props = {
  onClose: () => void;
};

export default function PointsForm({ onClose }: Props) {
  const { shop, setShop } = useShopStore();
  const [usdPoints, setUsdPoints] = useState(
    shop?.usd ? shop.usd.toString() : "0"
  );
  const [fcdPoints, setFcdPoints] = useState(
    shop?.fcd ? shop.fcd.toString() : "0"
  );
  const [pointsToUsd, setPointsToUsd] = useState(
    shop?.pointUsd ? shop.pointUsd.toString() : "0"
  );
  const [pointsToFcd, setPointsToFcd] = useState(
    shop?.pointFcd ? shop.pointFcd.toString() : "0"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!shop) return null;

  const handleSubmit = async () => {
    if (
      isEmptyString(usdPoints) ||
      isEmptyString(fcdPoints) ||
      isEmptyString(fcdPoints) ||
      isEmptyString(usdPoints) ||
      isEmptyString(pointsToUsd) ||
      isEmptyString(pointsToFcd)
    ) {
      setError(
        "Veuillez entrer le nombre de points en FC et en USD ou laisser les à 0"
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updatedShop: ShopType = {
        ...shop,
        usd: Number(usdPoints),
        fcd: Number(fcdPoints),
        pointUsd: Number(pointsToUsd),
        pointFcd: Number(pointsToFcd),
      };

      await storeData("shop", updatedShop);

      setTimeout(() => {
        setShop(updatedShop);
        setUsdPoints("");
        setFcdPoints("");
        setError("");
        setSuccess("Vos points ont été mis à jour avec succès!");
        onClose();
      });
    } catch (error) {
      setError("Une erreur s'est produite lors de la mise à jour des points");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        gap: 5,
        paddingTop: 10,
      }}
    >
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
            onChangeText={(text) => setPointsToUsd(text.replace(/[^0-9]/g, ""))}
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
            onChangeText={(text) => setPointsToFcd(text.replace(/[^0-9]/g, ""))}
            placeholder="ex: 500"
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
      </View>

      <View />

      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <ButtonComponent
        title="Enregistrer"
        onPress={handleSubmit}
        variant="default"
        disabled={
          loading ||
          (usdPoints === shop.usd?.toString() &&
            fcdPoints === shop.fcd?.toString() &&
            pointsToUsd === shop.pointUsd?.toString() &&
            pointsToFcd === shop.pointFcd?.toString())
        }
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
    </View>
  );
}

const styles = StyleSheet.create({
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
