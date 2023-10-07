import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import { FIREBASE_STORAGE } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function CameraScan({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  const toggleFlash = () => {
    if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashMode(Camera.Constants.FlashMode.on);
    } else {
      setFlashMode(Camera.Constants.FlashMode.off);
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      // Upload to Firebase Cloud Storage
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `photos/${Date.now()}.jpg`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle the upload progress if needed
        },
        (error) => {
          console.error("Error uploading image: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);

          // Navigate to page after the image upload is complete
          navigation.navigate("HomeScreen");
        }
      );
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        ref={cameraRef}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          {flashMode === Camera.Constants.FlashMode.off ? (
            <Ionicons name="flash-off" size={28} color="white" />
          ) : (
            <Ionicons name="flash" size={28} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialIcons name="flip-camera-ios" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.bottomBar}>
          <View style={styles.captureButtonOuter}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
            />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  goBackButton: {
    padding: 10,
  },
  flipButton: {
    position: "absolute",
    right: 50,
    bottom: "7%",
    padding: 10,
  },
  flashButton: {
    position: "absolute",
    left: 50,
    bottom: "7%",
    padding: 10,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 25,
  },
  captureButtonOuter: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#23B26E",
    justifyContent: "center",
    alignItems: "center",
  },
});
