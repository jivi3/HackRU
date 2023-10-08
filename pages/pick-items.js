import React, { useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Button,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { SwipeListView } from "react-native-swipe-list-view";
import { currencyFormatter } from "../utils";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const PickItems = ({ route, navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQty, setEditedQty] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsWithSelect, setItemsWithSelect] = useState({});
  const [selectedSummaryField, setSelectedSummaryField] = useState(null);
  const [editedSummaryValue, setEditedSummaryValue] = useState("");

  const user = FIREBASE_AUTH.currentUser;
  const { billData } = route.params;
  const [items, setItems] = useState(billData["items"]);

  const db = getFirestore();

  console.log("billData", billData);
  console.log("items", items);

  const truncateText = (text, length = 15) => {
    if (text) {
      return text.length > length ? text.substr(0, length) + "..." : text;
    }
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
    if (currentItem) {
      const itemExists = billData.items.unclaimed.hasOwnProperty(
        currentItem.id
      );

      if (itemExists) {
        const updatedItem = {
          ...billData.items.unclaimed[currentItem.id],
          name: editedName,
          price: editedPrice,
          quantity: editedQty,
        };

        billData.items.unclaimed[currentItem.id] = updatedItem;

        const billDocRef = doc(db, "bills", billData.id);

        try {
          await setDoc(
            billDocRef,
            { items: { unclaimed: billData.items.unclaimed } },
            { merge: true }
          );
          console.log("Firestore document updated successfully!");
        } catch (error) {
          console.error("Error updating Firestore document:", error);
        }
        setModalVisible(false);
      }
    } else {
      const newItemId = Date.now().toString();
      const newItem = {
        id: newItemId,
        name: editedName,
        price: editedPrice,
        quantity: parseFloat(editedQty),
      };

      billData.items.unclaimed[newItemId] = newItem;

      const billDocRef = doc(db, "bills", billData.id);

      try {
        await setDoc(
          billDocRef,
          { items: { unclaimed: billData.items.unclaimed } },
          { merge: true }
        );
        console.log("New item added successfully to Firestore!");
      } catch (error) {
        console.error("Error adding new item to Firestore:", error);
      }
      setModalVisible(false);
    }
  };

  console.log("Selecteditems", selectedItems);

  useEffect(() => {
    const sItems = {};

    if (items && items.unclaimed) {
      Object.keys(items.unclaimed).forEach((itemId) => {
        const item = items.unclaimed[itemId];
        sItems[itemId] = {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selected: false,
        };
      });
    }

    setItems(sItems);
  }, []);

  const handleLeftActionStatusChange = (statusData) => {
    const { key, isActivated } = statusData;

    if (isActivated) {
      const item = items[key];
      const newItem = {
        id: key,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      };

      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.some((existingItem) => existingItem.id === key)) {
          return prevSelectedItems;
        } else {
          return [...prevSelectedItems, newItem];
        }
      });
    }
  };

  const handleRightActionStatusChange = (statusData) => {
    const { key, isActivated } = statusData;

    if (isActivated) {
      const item = items[key];
      const newItem = {
        id: key,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      };
      console.log("newItem", newItem);
      setSelectedItems((prevItems) => prevItems.filter((i) => i.id !== key));
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={{ padding: 15 }}>
          <Text style={styles.header}>Bill Items</Text>
          {billData.users[0] === user.uid ? (
            <Text style={styles.subHeader}>
              Select to edit, Swipe to select
            </Text>
          ) : (
            <Text style={styles.subHeader}>Swipe to select</Text>
          )}
        </View>
        <SwipeListView
          data={Object.entries(items).map(([id, item]) => ({
            ...item,
            id,
          }))}
          keyExtractor={(item) => item.id}
          renderItem={(data, rowMap) =>
            billData.users[0] === user.uid ? (
              <TouchableHighlight
                key={data.item.id}
                style={{
                  marginHorizontal: 10,
                  borderRadius: 10,

                  padding: 0,
                  marginBottom: 10,
                }}
                onPress={() => openEditModal(data.item)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 20,
                    borderRadius: 10,
                    transition: "1s",
                    backgroundColor: data.item.selected ? "#23B26E" : "#fff",
                    shadowColor: "#171717",
                    shadowOffset: { width: -1, height: 3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  }}
                >
                  <Text style={styles.itemTitle}>
                    {truncateText(data.item.name)}
                  </Text>
                  <View style={styles.quantityBox}>
                    <Text style={styles.quantityText}>
                      {Math.floor(data.item.quantity)}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    ${currencyFormatter(data.item.price)}
                  </Text>
                </View>
              </TouchableHighlight>
            ) : (
              <View
                key={index}
                style={{
                  marginHorizontal: 10,
                  borderRadius: 10,
                  padding: 0,
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
                    backgroundColor: data.item.selected ? "#23B26E" : "#fff",
                    shadowColor: "#171717",
                    shadowOffset: { width: -1, height: 3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  }}
                >
                  <Text style={styles.itemTitle}>{data.item.name}</Text>
                  <View style={styles.quantityBox}>
                    <Text style={styles.quantityText}>
                      {Math.floor(data.item.quantity)}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    ${currencyFormatter(data.item.price)}
                  </Text>
                </View>
              </View>
            )
          }
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <MaterialCommunityIcons
                name="cart-plus"
                size={24}
                color="black"
              />
              <MaterialCommunityIcons
                style={{ marginRight: 14 }}
                name="cart-remove"
                size={24}
                color="black"
              />
            </View>
          )}
          rightActivationValue={-40}
          leftActivationValue={40}
          rightOpenValue={-20}
          leftOpenValue={20}
          onRightActionStatusChange={handleRightActionStatusChange}
          onLeftActionStatusChange={handleLeftActionStatusChange}
          stopRightSwipe={-80}
          stopLeftSwipe={80}
          style={{ height: 560, padding: 20 }}
        />

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
            <TouchableHighlight
              activeOpacity={1}
              underlayColor="#3ade90"
              style={styles.addItemButton}
              onPress={() => openEditModal()}
            >
              <Text style={styles.addIcon}>+</Text>
            </TouchableHighlight>
          </View>
        )}
        <View style={{ alignItems: "center" }}>
          <View style={styles.summary}>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.summaryText}>Tax</Text>
              <Text style={styles.summaryValue}>
                ${currencyFormatter(billData.summary.tax)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.summaryText}>Gratuity</Text>

              <Text style={styles.summaryValue}>
                ${currencyFormatter(billData.summary.gratuity)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.summaryText}>Total</Text>
              <Text style={styles.summaryValue}>
                ${currencyFormatter(billData.summary.total)}
              </Text>
            </View>
          </View>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor="#3ade90"
            style={styles.continueButton}
            onPress={() =>
              navigation.navigate("Payment", {
                selectedItems: selectedItems,
                billData: billData,
              })
            }
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableHighlight>
        </View>
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
            <TouchableHighlight
              onPress={() => {
                console.log("Save button pressed");
                handleEditSave();
              }}
              style={styles.saveButton}
              activeOpacity={1}
              underlayColor="#3ade90"
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableHighlight>
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
    borderRadius: 10,
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
    paddingHorizontal: 20,
    gap: 10,
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
    width: 200,
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

  rowBack: {
    alignItems: "center",

    flex: 1,
    flexDirection: "row",
    marginHorizontal: 2,
    justifyContent: "space-between",
    paddingLeft: 15,
  },
});

export default PickItems;
