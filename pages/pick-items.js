import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import itemsData from "../items.json";
import Modal from "react-native-modal";

import { currencyFormatter } from "../utils";

import { FIRESTORE, FIREBASE_AUTH } from "../firebaseConfig";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";

const PickItems = ({ route, navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQty, setEditedQty] = useState("");
  const [items, setItems] = useState(itemsData.items);
  const [billData, setBillData] = useState({});
  const [billItems, setBillItems] = useState([]);
  const [billUsers, setBillUsers] = useState([]);
  const [billSummary, setBillSummary] = useState([]);
  const summary = itemsData.summary;
  const user = FIREBASE_AUTH.currentUser;
  const { billId } = route.params;

  const db = getFirestore();

  const deleteItemById = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  useEffect(() => {
    console.log(billId);
    if (billId) {
      const fetchBillData = async () => {
        try {
          // const userDoc = await getDoc(doc(db, "bills", billId));
          const unsub = onSnapshot(doc(db, "bills", billId), (doc) => {
            const bItems = [];
            const bUsers = [];
            // const bSummary = [];
            doc.data().items.unclaimed.forEach((doc) => {
              bItems.push(doc);
            });
            doc.data().users.forEach((doc) => {
              bUsers.push(doc);
            });

            setBillSummary(doc.data().summary);
            setBillUsers(bUsers);
            setBillItems(bItems);
          });
        } catch (error) {
          console.error("Error fetching user name: ", error);
        }
      };
      fetchBillData();
    }
  }, []);

  useEffect(() => {
    console.log(billItems);
  }, [billItems]);

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        onPress={() => deleteItemById(id)}
        style={styles.deleteBox}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  // const toggleItemSelection = (itemId) => {
  //   setSelectedItems((prevItems) =>
  //     prevItems.includes(itemId)
  //       ? prevItems.filter((id) => id !== itemId)
  //       : [...prevItems, itemId]
  //   );
  // };

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

  const handleEditSave = () => {
    if (currentItem) {
      const updatedItems = items.map((dataItem) =>
        dataItem.id === currentItem.id
          ? {
              ...dataItem,
              name: editedName,
              price: editedPrice,
              quantity: editedQty,
            }
          : dataItem
      );
      setItems(updatedItems);
    } else {
      const newItem = {
        id: (items.length + 1).toString(), // Assuming ids are sequential for simplicity
        name: editedName,
        price: editedPrice,
        quantity: parseFloat(editedQty),
      };
      setItems([...items, newItem]);
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.header}>Bill Items</Text>
        {billUsers[0] === user.uid && (
          <Text style={styles.subHeader}>Select to edit</Text>
        )}
        <ScrollView
          contentInset={{ top: 0, left: 0, bottom: 60, right: 0 }}
          showsVerticalScrollIndicator={false}
          style={{ height: 580, padding: 12 }}
        >
          <View style={styles.itemsContainer}>
            {billItems.map((item) => {
              if (billUsers[0] === user.uid) {
                return (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={styles.itemTitle}>{item.name}</Text>
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
        {billUsers[0] === user.uid && (
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
            ${currencyFormatter(billSummary.tax)}
          </Text>

          <Text style={styles.summaryText}>Gratuity</Text>
          <Text style={styles.summaryValue}>
            ${currencyFormatter(billSummary.gratuity)}
          </Text>

          <Text style={styles.summaryText}>Total</Text>
          <Text style={styles.summaryValue}>
            ${currencyFormatter(billSummary.total)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("NewBill")}
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
              onPress={handleEditSave}
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
    borderRadius: 10,
  },
  input: {
    color: "#black",
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
    fontSize: 14, // Adjust as needed
  },
});

export default PickItems;