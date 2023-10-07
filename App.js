import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  StatusBar,
  navigation,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BillCard from "./components/bill-card/bill-card";
import waves from "./assets/waves.png";
import NewBill from "./pages/newBill";
import LoginView from "./pages/login-view";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Image source={waves} style={styles.bgImage} resizeMode="cover" />
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardContainer}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={{ fontSize: 32, fontWeight: "500" }}>
                Good evening
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "400",
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
                color="rgba(0,0,0,0.4)"
                onPress={() => navigation.navigate("NewBill")}
              />
            </View>
          </View>
          <ScrollView
            style={{ height: 700 }}
            contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.billsContainer}>
              {/* <Text style={{ fontSize: 18, fontWeight: "bold" }}>My Bills</Text> */}
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
              <BillCard
                restaurantName={"Mithaas"}
                date={"9/30/23"}
                paidBy={"Indra"}
                yourShare={"73.46"}
                totalBill={"74.63"}
                otherPeople={"with dpatil1128 and "}
                numOtherPeople={"2 others"}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewBill" component={NewBill} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
  },
  bgImage: {
    position: "absolute",
    // width: 400,
    // height: 200,
    // paddingTop: 900,
    bottom: 54,
  },
  dashboardContainer: {
    padding: 20,
    flexDirection: "column",
    gap: 10,
    // backgroundColor: "#f4f4ff",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
    // justifyContent: "center",
    // alignContent: "center",
    // padding: 5,
    // flexDirection: "column",
  },
  text: {
    // color: "white",
  },
});

export default App;