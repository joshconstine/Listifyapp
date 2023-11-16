import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import Colors from "../constants/Colors";

export default function SignInCard() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err);
    }
  };
  const showSignInCard = () => {
    console.log("show sign in card");
  };
  return (
    <View style={styles.card}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>LOG IN</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          style={styles.input}
        />

        <TextInput
          value={password}
          placeholder="Password..."
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={styles.input}
        />
        <TouchableOpacity onPress={onSignInPress}>
          <Text style={styles.actionButton}>LOG IN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.separator}>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              width: 200,
            }}
          />
          <View style={styles.separatorMiddle}>
            <Text style={styles.separatorText}>OR</Text>
          </View>
        </View>
        <View style={styles.horizontalGroup}>
          <Text>New Here? </Text>
          <TouchableOpacity onPress={showSignInCard}>
            <Text style={styles.underlinedText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    alignItems: "center",
    height: "90%",
    padding: 40,
    borderRadius: 40,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  separatorText: {
    fontSize: 14,
    color: "grey",
  },
  separatorMiddle: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "grey",
    borderWidth: 2,
    padding: 4,
    borderRadius: 16,
    position: "absolute",
    backgroundColor: "white",
    top: -14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.accent.blue,
  },
  input: {
    borderBottomWidth: 1,
    width: 260,
  },
  topContainer: {
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: Colors.accent.darker,
    padding: 6,
    borderRadius: 10,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    width: 180,
  },
  separator: {
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "column",
  },
  underlinedText: {
    textDecorationLine: "underline",
  },
  horizontalGroup: {
    flexDirection: "row",
    gap: 4,
  },
});
