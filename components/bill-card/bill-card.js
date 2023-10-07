import { StyleSheet, Text, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BillCard = ({
  restaurantName,
  date,
  totalBill,
  yourShare,
  paidBy,
  otherPeople,
  numOtherPeople,
  paidWith,
}) => {
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

        <Text style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
          {otherPeople}
          <Text style={{ color: "black", fontWeight: 400 }}>
            {numOtherPeople}
          </Text>
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={{
            backgroundColor: "#d9d9d9",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}>
            Total Bill
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {totalBill}
          </Text>
          <Text style={{ textAlign: "center", fontSize: 10 }}>
            Paid by <Text style={{ fontWeight: "bold" }}> {paidBy}</Text>
          </Text>
        </View>
        <LinearGradient
          // Button Linear Gradient
          start={{ x: 0.1, y: 0.2 }}
          colors={["rgba(35, 178, 110, 1.0)", "rgba(35, 178, 110, 0.5)"]}
          style={{ borderRadius: 5, padding: 10 }}
        >
          <Text style={{ textAlign: "center", fontSize: 12, fontWeight: 500 }}>
            Your share
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}
          >
            {yourShare}
          </Text>
          <Text style={{ textAlign: "center", fontSize: 10 }}>plus tip</Text>
        </LinearGradient>
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
    // flex: 1,
    width: 330,
    padding: 20,
    textAlign: "left",
    backgroundColor: "rgb(255,255,255)",
    // backgroundColor: "000",
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    gap: 10,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default BillCard;