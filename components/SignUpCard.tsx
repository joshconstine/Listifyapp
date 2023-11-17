import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Colors from "../constants/Colors";
interface IProps {
  setShowLogin: (showLogin: boolean) => void;
}

export default function SignUpCard(props: IProps) {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const showSignInCard = () => {
    props.setShowLogin(true);
  };
  return (
    <View style={styles.card}>
      {!pendingVerification && (
        <View style={styles.topContainer}>
          <Text style={styles.title}>SIGN UP</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>

            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Type your username"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              style={styles.input}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              placeholder="Type your password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
              style={styles.input}
            />
          </View>
          <TouchableOpacity onPress={onSignUpPress}>
            <Text style={styles.actionButton}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}
      {pendingVerification && (
        <View>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify}>
            <Text>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
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
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={showSignInCard}>
            <Text style={styles.underlinedText}>Log In</Text>
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
  inputGroup: {
    flexDirection: "column",
    gap: 4,
  },
  label: {},
  forgotText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  forgot: {
    alignSelf: "flex-end",
  },
});
