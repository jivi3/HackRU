import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import { FIRESTORE, FIREBASE_STORAGE, FIREBASE_AUTH } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import LoadingSpinner from "../components/LoadingSpinner"; // adjust the path as necessary
import * as ImageManipulator from "expo-image-manipulator";
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

export default function CameraScan({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isLoading, setIsLoading] = useState(false);
  const userId = FIREBASE_AUTH.currentUser?.uid;
  const { billId } = route.params;
  console.log("billId", billId);
  const firestore = getFirestore();

  function watchUploadStatus(uid, callback) {
    const userRef = doc(firestore, "users", uid);
    return onSnapshot(userRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.uploaded) {
        callback();
      }
    });
  }

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === "granted");
    })();
  }, []);
  const [capturedPhoto, setCapturedPhoto] = useState(null); // state to hold the captured photo URI

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setIsLoading(true);
      setCapturedPhoto(photo.uri); // Display the captured photo on the screen

      setTimeout(async () => {
        // Compress the image
        const manipulatedPhoto = await compressImage(photo.uri);

        // Convert the compressed image to a blob
        const response = await fetch(manipulatedPhoto.uri);
        const blob = await response.blob();

        const storageRef = ref(
          FIREBASE_STORAGE,
          `users/${userId}/photos/${Date.now()}.jpg`
        );

        const userRef = doc(FIRESTORE, "users", userId);
        await setDoc(userRef, { uploaded: false }, { merge: true });

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
            setIsLoading(true);
            // Setup the Firestore listener right here
            const unsubscribe = onSnapshot(
              doc(FIRESTORE, "users", userId),
              (snapshot) => {
                const data = snapshot.data();
                if (data && data.uploaded) {
                  setTimeout(() => {
                    navigation.navigate("PickItems", { billId: billId });
                    setIsLoading(false);
                    setCapturedPhoto(null); // Hide the captured photo
                    unsubscribe(); // Important: detach the listener once done.
                  }, 2000); // 2000 milliseconds = 2 seconds
                }
              }
            );
          }
        );
      }, 500); // Delay of half a second // Display the captured photo for 1 second
    }
  };

  useEffect(() => {
    const fetchUserBills = async () => {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(db, "bills"),
            where("timeCreated", "array-contains", user.uid)
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

  const compressImage = async (uri) => {
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
    );

    const imageSizeInBytes = compressed.size;
    const imageSizeInMB = imageSizeInBytes / (1024 * 1024); // Convert to MB

    console.log(imageSizeInMB);

    console.log(imageSizeInMB);

    return compressed;
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

        <View style={styles.bottomBar}>
          <View style={styles.captureButtonOuter}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
            />
          </View>
        </View>
      </Camera>

      {/* Moved loadingContainer outside of the Camera component */}
      {capturedPhoto && (
        <View style={styles.loadingContainer}>
          <Image
            source={{ uri: capturedPhoto }}
            style={{ ...StyleSheet.absoluteFillObject }}
          />
          {isLoading && <LoadingSpinner color="#23B26E" />}
        </View>
      )}
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
  flashButton: {
    position: "absolute",
    right: 20, // 20 pixels from the right edge
    top: 20, // 20 pixels from the top edge
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Darkened background
    zIndex: 1000, // Ensure it's on top
  },
});