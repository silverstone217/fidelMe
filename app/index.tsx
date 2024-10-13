import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useUserNameStore } from "../lib/store";
import { sizeText, theme } from "../utils";
import { isEmptyString } from "../utils/function";
import { storeData } from "../lib/storage";
import { Redirect } from "expo-router";
import { ButtonComponent } from "../components/ButtonComponent";

export default function App() {
  const [myUsername, setMyUsername] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { username, setUsername } = useUserNameStore();

  if (username) {
    return <Redirect href={"/main"} />;
  }

  const handleChange = async () => {
    if (isEmptyString(myUsername)) {
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const trimUserName = myUsername.trim();
      const saveData = await storeData("username", trimUserName);

      setTimeout(() => setSuccess("Bienvenue, " + trimUserName), 1000);
      setTimeout(() => {
        setUsername(trimUserName as string);
        setMyUsername("");
      }, 1500);
    } catch (error) {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <Text style={{ fontFamily: "Lato_900Black", fontSize: sizeText.xl }}>
            Bienvenue sur <Text style={{ color: theme.primary }}>FidelMe!</Text>
          </Text>
          <Text
            style={{ fontFamily: "Lato_400Regular", fontSize: sizeText.sm }}
          >
            Ameliorer vos echanges avec vos clients en un clique.
          </Text>
        </View>

        {/* separator */}
        <View
          style={{
            height: 15,
          }}
        />

        <TextInput
          style={{
            fontFamily: "Lato_400Regular",
            fontSize: sizeText.md,
            width: "100%",
            borderWidth: 0.5,
            borderColor: "#000",
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          placeholder="Entrer un nom d'utilisateur"
          value={myUsername}
          onChangeText={setMyUsername}
          autoCorrect={false}
          returnKeyType="done"
        />

        {error && (
          <Text
            style={{
              fontFamily: "Lato_400Regular",
              fontSize: sizeText.xs,
              color: theme.error,
            }}
          >
            {error}
          </Text>
        )}

        {success && (
          <Text
            style={{
              fontFamily: "Lato_400Regular",
              fontSize: sizeText.xs,
              color: theme.success,
            }}
          >
            {success}
          </Text>
        )}

        <ButtonComponent
          title={loading ? "en cours..." : "Commencer"}
          variant="default"
          disabled={isEmptyString(myUsername) || loading}
          onPress={handleChange}
        />

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
          FidelMe inc 2024
        </Text>

        <StatusBar style="dark" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
});
