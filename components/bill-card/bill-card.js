import { StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const BillCard = ({ restaurantName, date, totalBill, yourShare, people }) => {
  const renderNumPeople = (people) => {
    if (people.length > 3) {
      return (
        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
          {people[0].name}, and{" "}
          <Text style={{ color: "black", fontWeight: 500 }}>
            {people.length - 1} others
          </Text>
        </Text>
      );
    } else {
      return (
        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
          {people[0].name} and {people[1].name}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleView}>
          <Text style={{ fontSize: 18, fontWeight: 500 }}>
            {restaurantName}
          </Text>
          <View
            style={{ padding: 5, borderRadius: 5, backgroundColor: "#23B26E" }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: 500 }}>
              {date}
            </Text>
          </View>
        </View>
        {people && renderNumPeople(people)}
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
            ${totalBill}
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
            ${yourShare}
          </Text>
          {/* <Text style={{ textAlign: "center", fontSize: 10 }}>plus tip</Text> */}
        </View>
        <View
          style={{
            backgroundColor: "#d9d9d9",
            padding: 14,
            // paddingHorizontal: 24,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            gap: 2,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}>
            Edit items
          </Text>
          <MaterialIcons name="edit" size={20} color="black" />
        </View>

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
    // marginBottom: 5,
  },
});

export default BillCard;