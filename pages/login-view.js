import {
    StyleSheet,
    Text,
    View,
    Pressable,
    SafeAreaView,
    ImageBackground,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    StatusBar,
    Platform,
  } from "react-native";
  import { useState } from "react";
  import LoginCard from "../components/login-card/login-card";
  import loginwaves from "../assets/loginwaves.png";
  
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { FIREBASE_AUTH } from "../firebaseConfig";
  
  const LoginView = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
  
    const auth = FIREBASE_AUTH;
    const signIn = async () => {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        //alert("Success");
        //console.log(response);
        navigation.navigate("NewBill");
        // Navigate to the main/home screen or any other action on successful sign-in.
      } catch (error) {
        alert("Sign in Failed: " + error.message);
      }
    };
  
    const signUp = async () => {
      try {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password
        );r
        console.log("User registered:", response);
        // Send verification email, or navigate to a welcome screen, or other actions on successful sign-up.
      } catch (error) {
        alert("Sign up Failed: " + error.message);
        console.log(error);
      }
    };
  
    const onPressFunction = () => {
      signIn();
    };
  
    if (Platform.OS === "web") {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loginView}>
            <View
              style={{
                padding: 22,
                // backgroundColor: "#f4f4ff",
                borderRadius: 20,
                // bottom: 0,
                // marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 70,
                  fontWeight: 700,
                  color: Platform.OS === "web" ? "#000" : "#f4f4ff",
                  // shadowColor: "#171717",
                  // shadowOffset: { width: -1, height: 2 },
                  // shadowOpacity: 0.25,
                  // shadowRadius: 2,
                  textAlign: "center",
                }}
              >
                FairShare
              </Text>
            </View>
  
            <View
              style={{
                gap: 20,
                // width: "120%",
                // height: "100%",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ gap: 10 }}>
                <View>
                  <Text style={{ fontSize: 24, fontWeight: 700 }}>Login</Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "rgba(0,0,0,0.5)",
                      fontWeight: 400,
                    }}
                  >
                    Please login to continue
                  </Text>
                </View>
  
                <LoginCard />
              </View>
  
              <View
                style={{
                  gap: 20,
                  alignItems: "center",
  
                  // marginTop: 10,
                }}
              >
                <Pressable
                  style={{
                    padding: 15,
                    backgroundColor: "#23B26E",
                    borderRadius: 10,
                    width: 250,
                    shadowColor: "#171717",
                    shadowOffset: { width: -1, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                  }}
                  onPress={() => onPressFunction()}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#fff",
                      textAlign: "center",
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
                <Text style={{ textAlign: "center" }}>
                  Don't have an account?
                  <Pressable onPress={() => navigation.navigate('SignUp')}>
                    <Text style={{ fontWeight: "bold" }}> Sign Up</Text>
                  </Pressable>
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    } else {
      return (
        <ImageBackground
          source={loginwaves}
          resizeMode="contain"
          style={styles.image}
        >
          <StatusBar hidden />
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={styles.loginView}>
                <View
                  style={{
                    padding: 22,
                    // backgroundColor: "#f4f4ff",
                    borderRadius: 20,
                    // bottom: 0,
                    // marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 70,
                      fontWeight: 700,
                      color: Platform.OS === "web" ? "#000" : "#f4f4ff",
                      // shadowColor: "#171717",
                      // shadowOffset: { width: -1, height: 2 },
                      // shadowOpacity: 0.25,
                      // shadowRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    FairShare
                  </Text>
                </View>
  
                <View
                  style={{
                    gap: 20,
                    // width: "120%",
                    // height: "100%",
                    flexDirection: "column",
                    // justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ gap: 10 }}>
                    <View>
                      <Text style={{ fontSize: 24, fontWeight: 700 }}>Login</Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(0,0,0,0.5)",
                          fontWeight: 400,
                        }}
                      >
                        Please login to continue
                      </Text>
                    </View>
  
                    <LoginCard
                      setEmail={(e) => setEmail(e)}
                      setPassword={(e) => setPassword(e)}
                    />
                  </View>
  
                  <View
                    style={{
                      gap: 20,
                      alignItems: "center",
  
                      // marginTop: 10,
                    }}
                  >
                    <Pressable
                      style={{
                        padding: 15,
                        backgroundColor: "#23B26E",
                        borderRadius: 10,
                        width: 250,
                        shadowColor: "#171717",
                        shadowOffset: { width: -1, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                      }}
                      //onPress={() => navigation.navigate("HomeScreen")}
                      onPress={() => onPressFunction()}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        Login
                      </Text>
                    </Pressable>
                    <Text style={{ textAlign: "center" }}>
                      Don't have an account?
                      <Text style={{ fontWeight: "bold" }}> Sign Up</Text>
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </ImageBackground>
      );
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Platform.OS === "web" ? "#f4f4ff" : "transparent",
    },
    loginView: {
      padding: 20,
      gap: 80,
      flexDirection: "column",
      justifyContent: "space-around",
    },
    image: {
      flex: 1,
      justifyContent: "center",
      // width: "100%",
    },
  });
  
  export default LoginView;