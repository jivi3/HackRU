import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Button,
} from "react-native";
import Modal from "react-native-modal";

import { currencyFormatter } from "../utils";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const PickItems = ({ route, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQty, setEditedQty] = useState("");
  const [selectedSummaryField, setSelectedSummaryField] = useState(null);
  const [editedSummaryValue, setEditedSummaryValue] = useState("");

  const user = FIREBASE_AUTH.currentUser;
  const { billData } = route.params;
  const db = getFirestore();

  const truncateText = (text, length = 15) => {
    return text.length > length ? text.substr(0, length) + "..." : text;
  };

  const deleteItemById = (id) => {
    const filteredItems = billData.items.filter((item) => item.id !== id);
    setItems(filteredItems); // Please note: You might want to update this in the Firestore too.
  };

  const openEditModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setEditedName(item.name);
      setEditedPrice(item.price.toString());
      setEditedQty(item.quantity.toString());
    } else {
      setCurrentItem(null);
      setEditedName("");
      setEditedPrice("");
      setEditedQty("");
    }
    setModalVisible(true);
  };

  const handleEditSave = async () => {
    console.log("Bill id:", billData.id);

    if (currentItem) {
      const itemIndex = billData.items.findIndex(
        (item) => item.id === currentItem.id
      );

      if (itemIndex !== -1) {
        const updatedItem = {
          ...billData.items[itemIndex],
          name: editedName,
          price: editedPrice,
          quantity: editedQty,
        };

        billData.items[itemIndex] = updatedItem;

        // Reference to the specific bill in Firestore
        const billDocRef = doc(db, "bills", billData.id);

        // Update the Firestore Document
        try {
          await setDoc(
            billDocRef,
            { items: { unclaimed: billData.items } },
            { merge: true }
          );
          console.log("Firestore document updated successfully!");
        } catch (error) {
          console.error("Error updating Firestore document:", error);
        }
        setModalVisible(false);
      }
    } else {
      const newItem = {
        name: editedName,
        price: editedPrice,
        quantity: parseFloat(editedQty),
      };
      billData.items.push(newItem);

      // Reference to the specific bill in Firestore
      const billDocRef = doc(db, "bills", billData.id);

      // Update the Firestore Document with the new item
      try {
        await setDoc(
          billDocRef,
          { items: { unclaimed: billData.items } },
          { merge: true }
        );
        console.log("New item added successfully to Firestore!");
      } catch (error) {
        console.error("Error adding new item to Firestore:", error);
      }
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.header}>Bill Items</Text>
        {billData.users[0] === user.uid && (
          <Text style={styles.subHeader}>Select to edit</Text>
        )}
        <ScrollView
          contentInset={{ top: 0, left: 0, bottom: 60, right: 0 }}
          showsVerticalScrollIndicator={false}
          style={{ height: 580, padding: 12 }}
        >
          <View style={styles.itemsContainer}>
            {billData.items &&
              billData.items.map((item) => {
                if (billData.users[0] === user.uid) {
                  return (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => openEditModal(item)}
                    >
                      <Text style={styles.itemTitle}>
                        {truncateText(item.name)}
                      </Text>
                      <View style={styles.quantityBox}>
                        <Text style={styles.quantityText}>
                          {Math.floor(item.quantity)}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        ${currencyFormatter(item.price)}
                      </Text>
                    </TouchableOpacity>
                  );
                } else
                  return (
                    <View style={styles.item}>
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      <View style={styles.quantityBox}>
                        <Text style={styles.quantityText}>
                          {Math.floor(item.quantity)}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        ${currencyFormatter(item.price)}
                      </Text>
                    </View>
                  );
              })}
          </View>
        </ScrollView>
        <LinearGradient
          style={{ width: "100%", marginTop: -100, height: 100 }}
          colors={["rgba(244, 244, 255, 0.1)", "rgba(244, 244, 255, 0.8)"]}
          pointerEvents={"none"}
        />
        {billData.users[0] === user.uid && (
          <View
            style={{
              position: "absolute",
              marginTop: 570,
              alignItems: "center",
              width: "100%",
              display: "flex",
            }}
          >
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() => openEditModal()}
            >
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Tax</Text>
          <Text style={styles.summaryValue}>
            ${currencyFormatter(billData.summary.tax)}
          </Text>

          <Text style={styles.summaryText}>Gratuity</Text>
          <Text style={styles.summaryValue}>
            ${currencyFormatter(billData.summary.gratuity)}
          </Text>

          <Text style={styles.summaryText}>Total</Text>
          <Text style={styles.summaryValue}>
            ${currencyFormatter(billData.summary.total)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Item"
              placeholderTextColor="#999"
              style={styles.input}
            />
            <TextInput
              value={editedPrice}
              onChangeText={setEditedPrice}
              placeholder="Price"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              value={editedQty}
              onChangeText={setEditedQty}
              placeholder="Quantity"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="numeric"
            />
            <TouchableOpacity
              activeOpacity={0.1}
              onPress={() => {
                console.log("Save button pressed");
                handleEditSave();
              }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#F4f4ff",
  },
  billsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 18,
    color: "#23B26E",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  itemSelected: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#4CAF50",
  },
  itemTitle: {
    flex: 2,
    fontSize: 16,
  },
  itemQuantity: {
    flex: 1,
    fontSize: 16,
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  addItemButton: {
    width: "50%",
    padding: 15,
    backgroundColor: "rgb(244, 244, 255)",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    shadowColor: "#171717",
    shadowOffset: { width: -3, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    zIndex: 999,
    marginVertical: 20,
  },
  addIcon: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  continueButton: {
    padding: 15,
    backgroundColor: "#23B26E",
    alignItems: "center",
    borderRadius: 5,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "#f4f4ff",
    padding: 20,
    bottom: 140,
    borderRadius: 10,
  },
  input: {
    color: "black",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButton: {
    backgroundColor: "#23B26E",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 14,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    width: 100,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  quantityBox: {
    backgroundColor: "#D9D9D9",
    width: 30,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderRadius: 5,
  },
  quantityText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default PickItems;