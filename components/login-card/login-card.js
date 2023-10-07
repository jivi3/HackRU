import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import { useState } from "react";

const LoginCard = ({ setEmail, setPassword }) => {
  return (
    <View style={styles.loginCard}>
      <TextInput
        placeholder={"Email"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        // value={emailState}
        onChangeText={(value) => setEmail(value)}
        inputMode={"email"}
        style={styles.input}
      />
      <TextInput
        placeholder={"Password"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        style={styles.input}
        // value={passwordState}
        onChangeText={(value) => setPassword(value)}
        autoComplete={"current-password"}
        secureTextEntry={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loginCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    width: 350,
  },
  input: {
    height: 40,
    margin: 12,
    // borderWidth: 1,
    padding: 10,

    backgroundColor: "#e6e6fa",
    borderRadius: 5,
  },
});

export default LoginCard;