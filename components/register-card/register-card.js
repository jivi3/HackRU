import React from 'react';
import { StyleSheet, View, TextInput } from "react-native";

const RegisterCard = ({ setFirstName, setLastName, setEmail, setPassword, setConfirmPassword }) => {
  return (
    <View style={styles.registerCard}>
      <TextInput
        placeholder={"First Name"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        onChangeText={(value) => setFirstName(value)}
        style={styles.input}
      />
      <TextInput
        placeholder={"Last Name"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        onChangeText={(value) => setLastName(value)}
        style={styles.input}
      />
      <TextInput
        placeholder={"Email"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        onChangeText={(value) => setEmail(value)}
        inputMode={"email"}
        style={styles.input}
      />
      <TextInput
        placeholder={"Password"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        onChangeText={(value) => setPassword(value)}
        autoComplete={"current-password"}
        secureTextEntry={true}
        style={styles.input}
      />
      <TextInput
        placeholder={"Confirm Password"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        onChangeText={(value) => setConfirmPassword(value)}
        autoComplete={"current-password"}
        secureTextEntry={true}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  registerCard: {
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
    padding: 10,
    backgroundColor: "#f4f4ff",
    borderRadius: 5,
  },
});

export default RegisterCard;