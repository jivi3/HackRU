import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
} from "react-native";
import itemsData from "../items.json";
import Modal from "react-native-modal";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const PickItems = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQty, setEditedQty] = useState("");
  const [items, setItems] = useState(itemsData.items);
  const summary = itemsData.summary;

  const deleteItemById = (id) => {
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

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

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(itemId)
        ? prevItems.filter((id) => id !== itemId)
        : [...prevItems, itemId]
    );
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
        <Text style={styles.header}>Your Items</Text>
        <Text style={styles.subHeader}>Select to edit</Text>

        <FlatList
          contentInset={{ top: 0, left: 0, bottom: 60, right: 0 }}
          showsVerticalScrollIndicator={false}
          data={items}
          style={{ height: 580, padding: 12 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
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
                <Text style={styles.itemPrice}>{item.price}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
        <LinearGradient
          style={{ width: "100%", marginTop: -100, height: 100 }}
          colors={["rgba(244, 244, 255, 0.1)", "rgba(244, 244, 255, 0.8)"]}
          pointerEvents={"none"}
        />
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

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Tax</Text>
          <Text style={styles.summaryValue}>{summary.tax}</Text>

          <Text style={styles.summaryText}>Gratuity</Text>
          <Text style={styles.summaryValue}>{summary.gratuity}</Text>

          <Text style={styles.summaryText}>Total</Text>
          <Text style={styles.summaryValue}>{summary.total}</Text>
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

// Styles adjusted to reflect the design provided
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: "#F4f4ff",
    // alignItems: "center"
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    // marginBottom: 5,
  },
  subHeader: {
    fontSize: 18,
    color: "#23B26E",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center", // This ensures the title and the box are vertically aligned.
    justifyContent: "space-between",
    padding: 25,
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
    // alignItems: "center",
    // position: "absolute",
    // marginTop: 600,
    width: "50%",
    padding: 15,
    // backgroundColor: "#f4f4ff",
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
    marginBottom: 5, // Space between the label and value
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
    // borderWidth: 1,
    // borderColor: "white",
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
    width: 30, // Set a fixed width or height. Adjust this value as required.
    aspectRatio: 1, // This ensures the box remains a square.
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10, // Adjust as needed for spacing from the title.
    borderRadius: 5, // Small rounded corners. Remove or adjust as needed.
  },
  quantityText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14, // Adjust as needed
  },
});

export default PickItems;