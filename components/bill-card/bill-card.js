import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { fixedLengthText, currencyFormatter } from "../../utils";
import { FIREBASE_AUTH } from "../../firebaseConfig";

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

const BillCard = ({
  merchant,
  date,
  totalBill,
  yourShare,
  people,
  setEditNavigate,
  billId,
}) => {
  const [userNames, setUserNames] = useState([]);
  const user = FIREBASE_AUTH.currentUser;
  const db = getFirestore();

  async function fetchUserNames(userIds) {
    if (!userIds || userIds.length === 0) {
      throw new Error("No user IDs provided");
    }
    const firstNames = [];
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("__name__", "in", userIds)
      );
      const querySnapshot = await getDocs(usersQuery);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData && userData.firstName) {
          firstNames.push(userData.firstName);
        }
      });
    } catch (error) {
      console.error("Error fetching user names:", error);
      throw error;
    }
    return firstNames;
  }

  useEffect(() => {
    async function fetchUserNamesFromDB() {
      const names = await fetchUserNames(people);
      setUserNames(names);
    }

    fetchUserNamesFromDB();
  }, [people]);

  const renderNumPeople = (people) => {
    if (people.length >= 3) {
      return (
        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
          {people[0]}, and{" "}
          <Text style={{ color: "black", fontWeight: 500 }}>
            {people.length - 1} others
          </Text>
        </Text>
      );
    } else if (people.length === 2) {
      return (
        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
          {people[0]} and {people[1]}
        </Text>
      );
    } else
      return (
        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
          {people[0]}
        </Text>
      );
  };

  const getYourShare = (yourShare) => {
    if (yourShare) {
      return "$" + currencyFormatter(yourShare);
    } else {
      return "Select";
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleView}>
          <Text style={{ fontSize: 18, fontWeight: 500 }}>
            {fixedLengthText(merchant, 16)}
          </Text>
          <View
            style={{
              padding: 5,
              borderRadius: 5,
              backgroundColor: "#23B26E",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>
              {date}
            </Text>
          </View>
        </View>
        {userNames && renderNumPeople(userNames)}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
        <View
          style={{
            backgroundColor: "#d9d9d9",
            padding: 15,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}>
            Total Bill
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            ${currencyFormatter(totalBill)}
          </Text>
          {/* <Text style={{ textAlign: "center", fontSize: 10 }}>
            Paid by <Text style={{ fontWeight: "bold" }}> {paidBy}</Text>
          </Text> */}
        </View>
        <View
          style={{
            backgroundColor: "#d9d9d9",
            padding: 15,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}>
            Your share
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {getYourShare(yourShare)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setEditNavigate(billId);
          }}
        >
          <View
            style={{
              backgroundColor: "#d9d9d9",
              padding: 14,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              gap: 2,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}
            >
              Select items
            </Text>
            <MaterialIcons name="edit" size={20} color="black" />
          </View>
        </TouchableOpacity>

        {/* <View
          styles={{
            flexDirection: "column",
            gap: 100,
          }}
        >
          <Pressable
            style={{
              padding: 6,
              backgroundColor: "#3183FF",
              borderRadius: 5,
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}
            >
              H
            </Text>
          </Pressable>

          <Pressable
            style={{
              padding: 6,
              backgroundColor: "#23B26E",
              borderRadius: 5,
              width: "100%",
            }}
          >
            <Text
              style={{ textAlign: "center", fontSize: 14, fontWeight: 600 }}
            >
              Pay Indra
            </Text>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 330,
    padding: 20,
    textAlign: "left",
    backgroundColor: "rgb(255,255,255)",
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    flexDirection: "column",
    gap: 10,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default BillCard;
