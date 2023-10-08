import { StyleSheet, View, TextInput } from "react-native";

const LoginCard = ({ setEmail, setPassword }) => {
  return (
    <View style={styles.loginCard}>
      <TextInput
        placeholder={"Email"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        onChangeText={(value) => setEmail(value)}
        style={styles.input}
      />
      <TextInput
        placeholder={"Password"}
        placeholderTextColor={"#8c8c8c"}
        enablesReturnKeyAutomatically={true}
        style={styles.input}
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
    padding: 10,
    backgroundColor: "#f4f4ff",
    borderRadius: 5,
  },
});

export default LoginCard;
