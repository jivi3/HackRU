import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import waves from "../assets/waves.png";
import RegisterCard from "../components/register-card/register-card";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // assuming you have the auth instance exported from firebaseConfig

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const setEmailWrapper = (value) => {
    setEmail(value);
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Firebase authentication for user registration
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user; // Extracting the authenticated user

      // Initialize Firestore
      const db = getFirestore();

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        // Use setDoc instead of addDoc here
        firstName: firstName,
        lastName: lastName,
        email: email,
        // ... [other fields]
      });

      console.log("User data added with UID: ", user.uid);
      alert("Success!");
      navigation.navigate("NewBill");
    } catch (e) {
      console.error("Error registering user: ", e);
      if (e.code && e.message) {
        alert(e.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={waves} style={styles.waveBackground} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.signUpView}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Register</Text>
          </View>
          <View style={styles.inputContainer}>
            <RegisterCard
              setFirstName={(value) => {
                setFirstName(value);
                //console.log("First Name:", value);
              }}
              setLastName={(value) => {
                setLastName(value);
                //console.log("Last Name:", value);
              }}
              setEmail={(value) => {
                setEmailWrapper(value);
                //console.log("Email:", value);
              }}
              setPassword={(value) => {
                setPassword(value);
                //console.log("Password:", value);
              }}
              setConfirmPassword={(value) => {
                setConfirmPassword(value);
                //console.log("Confirm Password:", value);
              }}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
                <Text style={styles.buttonText}>Test</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFriends')}>
              <Text style={styles.buttonText}>Test 2</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
  },
  signUpView: {
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  header: {
    paddingVertical: 22,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 50,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  formContainer: {
    gap: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B1B1B1",
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  button: {
    marginTop: 30,
    marginHorizontal: 50,
    backgroundColor: "#23B26E",
    padding: 15,
    borderRadius: 10,
    width: 250,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  waveBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    resizeMode: "cover",
  },
});

export default SignUp;