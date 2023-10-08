import React from "react";
import { useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import waves from "../assets/waves.png";
import { Linking, Platform } from "react-native";
import { currencyFormatter } from "../utils";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  docRef,
} from "@firebase/firestore";

const Payment = ({ route, navigation }) => {
  const db = getFirestore();
  const { selectedItems, billData } = route.params;

  console.log("sItemsPayment", selectedItems);

  console.log("bDataPayment", billData);

  const handleCashPayment = () => {
    alert("Cash payment recorded!");
  };

  const handleVenmoPayment = () => {
    updateBillWithSelectedItems();
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

  const totalCost = (items) => {
    let totalcost = 0;
    items.forEach((item) => {
      totalcost += item.price;
    });
    return "$" + currencyFormatter(totalcost);
  };

  const updateBillWithSelectedItems = async () => {
    const userId = FIREBASE_AUTH.currentUser?.uid;

    if (!userId) {
      console.error("No user is currently logged in!");
      return;
    }

    const billDocumentId = billData.id;

    const billRef = doc(db, "bills", billDocumentId);

    const docSnapshot = await getDoc(billRef);
    if (docSnapshot.exists()) {
      const currentData = docSnapshot.data();

      const newData = {
        ...currentData,
        items: {
          ...currentData.items,
          [userId]: {
            ...selectedItems,
          },
        },
      };

      await updateDoc(billRef, newData);
    } else {
      console.error("Document does not exist.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image source={waves} style={styles.waveBackground} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.paymentView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Pay Indra</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "500",
                color: "rgba(0, 0, 0, 0.60)",
              }}
            >
              for {billData?.summary?.merchant}
            </Text>
          </View>
          <ScrollView
            style={{ height: 520 }}
            contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {selectedItems.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 10,
                      borderRadius: 10,
                      padding: 0,
                      width: 300,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 20,
                        borderRadius: 10,
                        transition: "1s",
                        backgroundColor: "#23B26E",

                        shadowColor: "#171717",
                        shadowOffset: { width: -1, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      }}
                    >
                      <Text style={{ flex: 2, fontSize: 16 }}>{item.name}</Text>
                      <View
                        style={{
                          backgroundColor: "#D9D9D9",
                          width: 30,
                          aspectRatio: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {Math.floor(item.quantity)}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        ${currencyFormatter(item.price)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.paymentInputContainer}>
            <View style={styles.costContainer}>
              <Text
                style={{ fontSize: 20, fontWeight: 400, textAlign: "center" }}
              >
                Total Cost:{" "}
                <Text
                  style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
                >
                  {totalCost(selectedItems)}
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleVenmoPayment}
              >
                <Text style={styles.buttonText}>Pay with Venmo</Text>
              </TouchableOpacity>
            </View>
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
    gap: 10,
  },

  costContainer: {
    width: 250,
    gap: 10,
    padding: 15,

    borderRadius: 10,
    backgroundColor: "#FFF",
    textAlign: "right",
    fontSize: 18,
  },

  input: {
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
  },
  paymentView: {
    padding: 20,
    flexDirection: "column",
  },
  header: {
    borderRadius: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#008CFF",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
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
