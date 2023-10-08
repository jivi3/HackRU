import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BillCard from "../components/bill-card/bill-card";
import waves from "../assets/waves.png";

const people = [
  { name: "Darshan Patil" },
  { name: "Jivi Irivichetty" },
  { name: "Rishi Parmar" },
  { name: "Indraneel Vaka" },
];

function HomeScreen({ navigation }) {
  return (
    <View>
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardContainer}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={{ fontSize: 32, fontWeight: "600" }}>
                Good evening
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "500",
                  color: "rgba(0, 0, 0, 0.60)",
                }}
              >
                You owe <Text style={{ color: "#ffac0b" }}>$54.18</Text>
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <Button title="Go to Details" onPress={() => navigation.navigate('NewBill')}/> */}
              <MaterialIcons
                name="add-box"
                size={50}
                color="#23B26E"
                onPress={() => navigation.navigate("NewBill")}
              />
            </View>
          </View>
          <ScrollView
            style={{ height: 670 }}
            contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.billsContainer}>
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                people={people}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f4f4ff",
    // flexDirection: "column",
  },
  dashboardContainer: {
    padding: 20,
    flexDirection: "column",
    gap: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  billsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
  },
});

export default HomeScreen;