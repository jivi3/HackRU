import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import waves from "../assets/waves.png";
import { Linking, Platform } from "react-native";

const Payment = ({ navigation }) => {
  const handleCashPayment = () => {
    alert("Cash payment recorded!");
  };

  const handleVenmoPayment = () => {
    const venmoScheme = "venmo://";
    const venmoAppStoreURL = "https://apps.apple.com/us/app/venmo/id351727428";
    const venmoPlayStoreURL =
      "https://play.google.com/store/apps/details?id=com.venmo";

    Linking.canOpenURL(venmoScheme)
      .then((supported) => {
        if (supported) {
          Linking.openURL(venmoScheme);
        } else {
          const storeURL =
            Platform.OS === "ios" ? venmoAppStoreURL : venmoPlayStoreURL;
          Linking.openURL(storeURL);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={waves} style={styles.waveBackground} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.paymentView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Payment</Text>
          </View>
          <View style={styles.paymentInputContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCashPayment}>
              <Text style={styles.buttonText}>Record Cash Payment</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inlineInput}
              keyboardType="numeric"
              placeholder="$94.76"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVenmoPayment}
            >
              <Text style={styles.buttonText}>Venmo Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paymentInputContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: 250,
    marginTop: 20,
  },

  inlineInput: {
    width: 250,
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    textAlign: "center",
    fontSize: 18,
  },

  input: {
    width: 250,
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    textAlign: "center",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
  },
  paymentView: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  header: {
    paddingVertical: 22,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 50,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    marginHorizontal: 50,
    backgroundColor: "#23B26E",
    padding: 15,
    borderRadius: 10,
    width: 250,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  waveBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    resizeMode: "cover",
  },
});

export default Payment;