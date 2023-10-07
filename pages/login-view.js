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
import { Animated, Easing } from "react-native";
import { useState } from "react";
import LoginCard, {
  email,
  password,
} from "../components/login-card/login-card";
import loginwaves from "../assets/loginwaves.png";
//import auth from "@react-native-firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";

const LoginView = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const buttonScale = new Animated.Value(1);
  const auth = FIREBASE_AUTH;
  const handlePress = () => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95, // Scale down to 0.95
        duration: 100, // Animation duration in milliseconds
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(buttonScale, {
        toValue: 1, // Scale back to 1
        duration: 100,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start();

    // Perform your login logic here
    signIn();
  };
  const signIn = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      alert("Success");
      console.log("Success:", response);
      // Navigate to the main/home screen or any other action on successful sign-in.
    } catch (error) {
      alert("Failed");
      console.log("Failed:", response);
    }
  };

  const signUp = async () => {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User registered:", response);
      // Send verification email, or navigate to a welcome screen, or other actions on successful sign-up.
    } catch (error) {
      alert("Sign up Failed: " + error.message);
      console.log(error);
    }
  };

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.container}>
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
              }}
            >
              <Pressable
                style={{
                  transform: [{ scale: buttonScale }],
                  padding: 15,
                  backgroundColor: "#23B26E",
                  borderRadius: 10,
                  width: 250,
                  shadowColor: "#171717",
                  shadowOffset: { width: -1, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                }}
                onPress={() => handlePress()}
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
                    onPress={() => handlePress()}
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
  },
});

export default LoginView;
