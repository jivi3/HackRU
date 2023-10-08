import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
  } from "react-native";
  import { useState, useEffect } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import BillCard from "../components/bill-card/bill-card";
  import { FIRESTORE, FIREBASE_AUTH } from "../firebaseConfig";
//   import { useFirestoreQuery } from "@react-query-firebase/firestore";
  import { useIsFocused } from "@react-navigation/native";
  import waves from "../assets/waves.png";
  
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
  import { fixedLengthText } from "../utils";
  
  const people = [
    { name: "Darshan Patil" },
    { name: "Jivi Irivichetty" },
    { name: "Rishi Parmar" },
    { name: "Indraneel Vaka" },
  ];
  
  const HomeView = ({ navigation }) => {
    const [userName, setUserName] = useState("");
    const hour = new Date().getHours();
    const [userBills, setUserBills] = useState([]);
    const [editNavigate, setEditNavigate] = useState("");
    const isFocused = useIsFocused();
    const [navWithId, setNavWithId] = useState(false);
  
    const user = FIREBASE_AUTH.currentUser;
    const db = getFirestore();
  
    useEffect(() => {
      if (user) {
        const fetchUserName = async () => {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserName(userDoc.data().firstName);
            }
          } catch (error) {
            console.error("Error fetching user name: ", error);
          }
        };
        fetchUserName();
      }
    }, []);
  
    useEffect(() => {
      if (editNavigate) {
        navigation.navigate("PickItems", { billId: editNavigate });
      }
    }, [editNavigate]);
  
    useEffect(() => {
      setEditNavigate(false);
    }, [isFocused]);
  
    useEffect(() => {
      const fetchUserBills = async () => {
        try {
          const querySnapshot = await getDocs(
            query(
              collection(db, "bills"),
              where("users", "array-contains", user.uid)
            )
          );
          const unsubscribe = onSnapshot(
            query(
              collection(db, "bills"),
              where("users", "array-contains", user.uid)
            ),
            (querySnapshot) => {
              const billSnapshots = [];
              querySnapshot.forEach((doc) => {
                billSnapshots.push(doc);
              });
              setUserBills(billSnapshots);
            }
          );
        } catch (error) {
          console.error("Error fetching user bills: ", error);
        }
      };
      fetchUserBills();
    }, []);
  
    // useEffect(() => {
    //   console.log("userBills", userBills);
    // }, [userBills]);
  
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
  
    const navigateWithBillId = () => {
      return navigation.navigate("CameraScan", { billId: editNavigate });
    };
  
    return (
      <View>
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
                    You owe <Text style={{ color: "#ffac0b" }}>$54.18</Text>
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      color: "rgba(0, 0, 0, 0.60)",
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
                    // onPress={(}
                  />
                </View>
              )}
            </View>
            {userBills.length > 0 ? (
              <ScrollView
                style={{ height: 670 }}
                contentInset={{ top: 0, left: 0, bottom: 30, right: 0 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.billsContainer}>
                  {userBills &&
                    userBills.map((bill) => {
                      return (
                        <BillCard
                          billId={bill.id}
                          merchant={bill.data()["summary"]["merchant"]}
                          date={bill.data()["summary"]["date"]}
                          paidBy={"Indra"}
                          yourShare={"19.00"}
                          setEditNavigate={(e) => setEditNavigate(e)}
                          totalBill={bill.data()["summary"]["total"]}
                          people={people}
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
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      // backgroundColor: "#f4f4ff",
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
  });
  
  export default HomeView;