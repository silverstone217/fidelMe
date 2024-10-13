import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { sizeText } from "../utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ModalComponent = ({ isOpen, onClose, title, children }: Props) => {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "90%",
            position: "relative",
            minHeight: "30%",
            maxHeight: "95%",
          }}
        >
          {/* top */}
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              paddingHorizontal: 10,
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            {title && (
              <Text
                style={{
                  fontFamily: "Lato_700Bold",
                  fontSize: sizeText.sm,
                  color: "white",
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            <Pressable
              onPress={onClose}
              style={{
                alignSelf: "flex-end",
                marginLeft: "auto",
              }}
            >
              <Icon name="close-outline" size={30} color="white" />
            </Pressable>
          </View>

          {/* main */}
          <View
            style={{
              paddingTop: 30,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
