import { View } from "react-native";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";

export const MinusButton = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.accent.darker,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AntDesign name="minus" size={24} color="white" />
    </View>
  );
};
