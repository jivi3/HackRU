import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import waves from "../assets/waves.png";
import Icon from "react-native-vector-icons/FontAwesome";

const NewBill = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalPosition = useRef(new Animated.Value(300)).current; 

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good evening</Text>
        <Text style={styles.directions}>Start a New Bill</Text>
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.verticalPart} />
        <View style={styles.horizontalPart} />
      </TouchableOpacity>
      <View style={styles.backButtonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} color="#000" />
      </View>
      <Image source={waves} style={styles.waveBackground} />

      {modalVisible && (
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalPosition }] }, 
            ]}
          >
            <TouchableOpacity onPress={() => navigation.navigate("CameraScan")}>
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
    paddingTop: 100,
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
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30, // Increase padding to make slide-out larger
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewBill;