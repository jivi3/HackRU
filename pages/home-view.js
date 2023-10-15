import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import BillCard from "../components/bill-card/bill-card";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { useIsFocused } from "@react-navigation/native";
import waves from "../assets/waves.png";
import LoadingSpinner from "../components/LoadingSpinner";
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

import { currencyFormatter } from "../utils";

const HomeView = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const hour = new Date().getHours();
  const [userBills, setUserBills] = useState([]);
  const [editNavigate, setEditNavigate] = useState("");
  const isFocused = useIsFocused();
  const [totalYourShare, setTotalYourShare] = useState(0);

  useEffect(() => {
    console.log("editNavigate", editNavigate);
  }, [editNavigate]);

  const user = FIREBASE_AUTH.currentUser;
  const userId = user.uid;
  const db = getFirestore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (user) {
      const fetchUserName = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().firstName);
          }
        } catch (error) {
          console.error("Error fetching user name: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      setTimeout(() => {
        fetchUserName();
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  async function fetchBillItems(billId) {
    try {
      const billItemsObject = { unclaimed: {} };
      const billRef = doc(db, "bills", billId);
      const billDoc = await getDoc(billRef);

      if (billDoc.exists) {
        const billD = billDoc.data();

        if (billD && billD.items && billD.items.unclaimed) {
          Object.keys(billD.items.unclaimed).forEach((itemId) => {
            const item = billD.items.unclaimed[itemId];
            billItemsObject.unclaimed[itemId] = {
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            };
          });

          return billItemsObject;
        } else {
          throw new Error("Expected data structure not found in the bill");
        }
      } else {
        throw new Error("Bill not found");
      }
    } catch (error) {
      console.error(`Error fetching items for bill ${billId}:`, error);
      throw error;
    }
  }

  async function fetchSummary(billId) {
    try {
      const billRef = doc(db, "bills", billId);
      const billDoc = await getDoc(billRef);
      if (billDoc.exists) {
        const billD = billDoc.data();
        if (billD && billD.summary) {
          return billD.summary;
        } else {
          throw new Error("Expected data structure not found in the bill");
        }
      } else {
        throw new Error("Bill not found");
      }
    } catch (error) {
      console.error(`Error fetching summary for bill ${billId}:`, error);
      throw error;
    }
  }

  async function fetchUsers(billId) {
    try {
      const billRef = doc(db, "bills", billId);
      const billDoc = await getDoc(billRef);
      const billUsers = [];
      if (billDoc.exists) {
        const billD = billDoc.data();
        if (billD && billD.users) {
          billD.users.forEach((item) => {
            billUsers.push(item);
          });
          return billUsers;
        } else {
          throw new Error("Expected data structure not found in the bill");
        }
      } else {
        throw new Error("Bill Users not found");
      }
    } catch (error) {
      console.error(`Error fetching summary for bill ${billId}:`, error);
      throw error;
    }
  }

  async function retrieveLatestBillItems(billId) {
    try {
      const items = await fetchBillItems(billId);
      const summary = await fetchSummary(billId);
      const users = await fetchUsers(billId);
      console.log("users", users);
      console.log("summary", summary);
      console.log("items", items);
      return { id: billId, items: items, summary: summary, users: users };
      console;
    } catch (error) {
      console.error("Error retrieving the latest bill items:", error);
    }
  }

  useEffect(() => {
    const sendData = async () => {
      if (editNavigate) {
        const billData = await retrieveLatestBillItems(editNavigate);
        if (editNavigate) {
          navigation.navigate("PickItems", { billData: billData });
        }
      }
    };
    sendData();
  }, [editNavigate]);

  useEffect(() => {
    setEditNavigate(null);
  }, [isFocused]);

  useEffect(() => {
    let totalSum = 0;

    // Set up the realtime listener
    const unsubscribe = onSnapshot(
      query(
        collection(db, "bills"),
        where("users", "array-contains", user.uid)
      ),
      (querySnapshot) => {
        const billSnapshots = [];
        totalSum = 0; // Reset to 0 for each new snapshot

        querySnapshot.forEach((doc) => {
          billSnapshots.push(doc);
          const billData = doc.data();
          if (billData && billData.items && billData.items[user.uid]) {
            const userItems = billData.items[user.uid];
            const userItemsSum = Object.values(userItems).reduce(
              (accum, item) => accum + item.price * item.quantity,
              0
            );
            totalSum += userItemsSum;
            console.log("uis", userItemsSum);
          }
        });
        setTotalYourShare(totalSum);
        setUserBills(billSnapshots);
      },
      (error) => {
        console.error("Error fetching user bills: ", error);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [db, user.uid]);

  const getGreeting = () => {
    if (userName && userName.length <= 7) {
      if (hour > 17) {
        return "Good Evening, " + userName;
      } else if (hour > 11) {
        return "Good Afternoon, " + userName;
      } else return "Good Morning, " + userName;
    } else {
      if (hour > 17) {
        return "Good Evening";
      } else if (hour > 11) {
        return "Good Afternoon";
      } else return "Good Morning";
    }
  };

  const shortenText = (text) => {
    if (text.length > 15) {
      return text.splice(0, 14) + "...";
    } else return text;
  };

  return (
    <View style={styles.outerContainer}>
      <Image
        source={waves}
        style={[
          styles.waveBackgroundEmpty,
          userBills.length > 0
            ? styles.waveBackground
            : styles.waveBackgroundEmpty,
        ]}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.dashboardContainer}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={{ fontSize: 28, fontWeight: "600" }}>
                {getGreeting()}
              </Text>
              {userBills.length > 0 ? (
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "500",
                    color: "rgba(0, 0, 0, 0.60)",
                  }}
                >
                  You owe{" "}
                  <Text style={{ color: "#ffac0b" }}>
                    ${currencyFormatter(totalYourShare)}
                  </Text>
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "400",
                    color: "rgba(0, 0, 0, 0.50)",
                  }}
                >
                  Start a new bill
                </Text>
              )}
            </View>
            {userBills.length > 0 && (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <MaterialIcons
                  name="add-box"
                  size={50}
                  color="#23B26E"
                  onPress={() => navigation.navigate("CameraScan")}
                />
              </View>
            )}
          </View>
          {userBills.length && userBills.length > 0 ? (
            <ScrollView
              style={{ height: 670 }}
              contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.billsContainer}>
                {userBills &&
                  userBills.map((bill, index) => {
                    const currentUserItems = bill.data().items[user.uid];
                    // console.log(c);
                    console.log("cui", currentUserItems);
                    let userItemsSum = 0;
                    if (currentUserItems) {
                      userItemsSum = Object.values(currentUserItems).reduce(
                        (accum, item) => accum + item.price * item.quantity,
                        0
                      );
                    }
                    return (
                      <BillCard
                        key={index}
                        billId={bill.id}
                        merchant={bill.data()["summary"]["merchant"]}
                        date={bill.data()["summary"]["date"]}
                        paidBy={"Indra"}
                        yourShare={userItemsSum.toFixed(2)}
                        setEditNavigate={(e) => setEditNavigate(e)}
                        totalBill={bill.data()["summary"]["total"]}
                        people={bill.data()["users"]}
                      />
                    );
                  })}
              </View>
            </ScrollView>
          ) : (
            <View
              style={{
                height: 800,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  navigation.navigate("CameraScan", { billId: editNavigate });
                }}
              >
                <View style={styles.verticalPart} />
                <View style={styles.horizontalPart} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
      {isLoading && (
        <View style={styles.spinnerContainerStyle}>
          <LoadingSpinner color="#23B26E" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    padding: 20,
    flexDirection: "column",
    gap: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  billsContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
  },
  iconContainer: {
    width: 230,
    height: 230,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    marginBottom: 300,
  },
  verticalPart: {
    position: "absolute",
    width: 25,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#747474",
  },
  horizontalPart: {
    position: "absolute",
    width: 100,
    height: 25,
    borderRadius: 10,
    backgroundColor: "#747474",
  },
  waveBackground: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    resizeMode: "cover",
  },
  waveBackgroundEmpty: {
    position: "absolute",
    bottom: 160,
    width: "100%",
    resizeMode: "cover",
  },
  spinnerContainerStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4ff",
    zIndex: 9999,
  },
});

export default HomeView;
