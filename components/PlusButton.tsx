import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Colors from "../constants/Colors";

const PlusButton = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.accent.blue,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="add" size={24} color="white" />
    </View>
  );
};

export default PlusButton;
