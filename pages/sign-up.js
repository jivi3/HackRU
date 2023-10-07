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
  import LoginCard from "../components/login-card/login-card"; // Assuming you might reuse this card for sign-up
  import loginwaves from "../assets/loginwaves.png";
  
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { FIREBASE_AUTH } from "../firebaseConfig";
  
  const SignUpView = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
  
    const auth = FIREBASE_AUTH;
  
    const signUp = async () => {
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", response);
        navigation.navigate("LoginView");
        // Navigate back to login screen or any other action on successful sign-up.
      } catch (error) {
        alert("Sign up Failed: " + error.message);
        console.log(error);
      }
    };
  
    if (Platform.OS === "web") {
      // ... (This part remains largely unchanged. I've omitted it for brevity)
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
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 70,
                      fontWeight: 700,
                      color: Platform.OS === "web" ? "#000" : "#f4f4ff",
                      textAlign: "center",
                    }}
                  >
                    FairShare
                  </Text>
                </View>
  
                <View
                  style={{
                    gap: 20,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <View style={{ gap: 10 }}>
                    <View>
                      <Text style={{ fontSize: 24, fontWeight: 700 }}>Sign Up</Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: "rgba(0,0,0,0.5)",
                          fontWeight: 400,
                        }}
                      >
                        Please sign up to continue
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
                      onPress={() => signUp()}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        Sign Up
                      </Text>
                    </Pressable>
                    <Text style={{ textAlign: "center" }}>
                      Already have an account?
                      <Text style={{ fontWeight: "bold" }}> Login</Text>
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
    },
  });
  
  export default SignUpView;
  