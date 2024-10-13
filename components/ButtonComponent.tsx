import { Text, Pressable } from "react-native";
import React from "react";
import { sizeText, theme } from "../utils";
import * as Haptics from "expo-haptics";

interface Props {
  title: string;
  onPress?: () => void;
  disabled: boolean;
  variant: "default" | "destructive" | "secondary" | "outline";
}

export const ButtonComponent = ({
  title,
  onPress,
  disabled,
  variant = "default",
}: Props) => {
  return (
    <Pressable
      style={{
        backgroundColor:
          variant === "default"
            ? theme.primary
            : variant === "destructive"
            ? theme.error
            : variant === "secondary"
            ? theme.secondary
            : "transparent",
        padding: 16,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: variant === "outline" ? 0 : 0.25,
        shadowRadius: variant === "outline" ? 0 : 3.84,
        elevation: variant === "outline" ? 0 : 5,
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: variant === "outline" ? "dimgray" : "#000",
        opacity: disabled ? 0.75 : 1,
      }}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync();
        onPress && onPress();
      }}
    >
      <Text
        style={{
          color:
            disabled && variant !== "outline"
              ? theme.textBtn
              : disabled && variant === "outline"
              ? theme.text
              : !disabled && variant === "outline"
              ? theme.text
              : theme.textBtn,
          fontFamily: "Lato_700Bold",
          fontSize: sizeText.sm,
          textTransform: "capitalize",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};
