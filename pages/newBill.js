import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import waves from "../assets/waves.png";
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const NewBill = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalPosition = useRef(new Animated.Value(300)).current;
  const [userName, setUserName] = useState("");

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (gestureState.dy > 0) {
        modalPosition.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dy > 25) {
        setModalVisible(false);
        modalPosition.setValue(300); // reset the position
      } else {
        Animated.spring(modalPosition, {
          toValue: 0,
          tension: 50,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const dismissModalWithAnimation = () => {
    Animated.timing(modalPosition, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(modalPosition, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalPosition, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().firstName);
          }
        }
      } catch (error) {
        console.error("Error fetching user name: ", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good evening, {userName}</Text>
        <Text style={styles.directions}>Start a new bill</Text>
      </View>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.verticalPart} />
        <View style={styles.horizontalPart} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={waves} style={styles.waveBackground} />

      {modalVisible && (
        <View style={styles.overlay}>
          {/* This TouchableOpacity fills the entire overlay and closes the modal when pressed */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          />

          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalPosition }] },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.dragNotch} />
            <TouchableOpacity
              style={styles.modalContent}
              onPress={() => {
                navigation.navigate("CameraScan");
                dismissModalWithAnimation();
              }}
            >
              <Icon name="camera" size={24} color="#000" />
              <Text style={styles.modalText}>Scan Receipt</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4FF",
    alignItems: "center",
  },
  backButtonContainer: {
    position: "absolute",
    top: 0,
    left: 10,
    paddingTop: 20,
    paddingLeft: 10,
  },
  header: {
    flex: 1,
    width: "100%",
    paddingTop: 70,
    paddingLeft: 20,
    justifyContent: "flex-start",
    flexDirection: "column",
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
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  directions: {
    fontSize: 18,
    color: "rgba(0,0,0,0.5)",
  },
  waveBackground: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    // zIndex: 99,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // zIndex: 999,
  },
  dragNotch: {
    width: 40,
    height: 5,
    backgroundColor: "gray",
    borderRadius: 2.5,
    marginBottom: 10,
    alignSelf: "center",
  },
  modalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewBill;
