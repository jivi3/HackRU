import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { Camera } from "expo-camera";
import { FIRESTORE, FIREBASE_STORAGE, FIREBASE_AUTH } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import LoadingSpinner from "../components/LoadingSpinner";
import * as ImageManipulator from "expo-image-manipulator";
import {
  getFirestore,
  onSnapshot,
  getDoc,
  doc,
  setDoc,
} from "@firebase/firestore";

export default function CameraScan({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isLoading, setIsLoading] = useState(false);
  const userId = FIREBASE_AUTH.currentUser?.uid;
  const firestore = getFirestore();
  const user = FIREBASE_AUTH.currentUser;
  const db = getFirestore();
  const [billData, setBillData] = useState();
  const [billSummary, setBillSummary] = useState();
  const [navItems, setNavItems] = useState(false);
  const [billID, setBillID] = useState();

  function watchUploadStatus(uid, callback) {
    const userRef = doc(firestore, "users", uid);
    return onSnapshot(userRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.uploaded) {
        callback();
      }
    });
  }

  useEffect(() => {
    if (billData) {
      navigation.navigate("PickItems", {
        billData: billData,
      });
    }
  }, [billData]);

  const fetchMostRecentBill = async () => {
    try {
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      const bills = userDoc.data().bills;

      if (bills && bills.length > 0) {
        const mostRecentBill = bills[bills.length - 1];
        return mostRecentBill;
      } else {
        console.log("No bills found for the user");
        return null;
      }
    } catch (error) {
      console.error("Error fetching the most recent bill: ", error);
      return null;
    }
  };

  async function fetchBillItems(billId) {
    try {
      const billRef = doc(db, "bills", billId);
      const billDoc = await getDoc(billRef);
      const billItemsArray = [];
      if (billDoc.exists) {
        const billD = billDoc.data();
        if (billD && billD.items) {
          billD.items.unclaimed.forEach((item) => {
            billItemsArray.push(item);
          });
          return billItemsArray;
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
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  async function fetchWithDelay() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await fetchMostRecentBill();
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

  async function retrieveLatestBillItems() {
    try {
      const billId = await fetchMostRecentBill();
      const items = await fetchBillItems(billId);
      const summary = await fetchSummary(billId);
      const users = await fetchUsers(billId);
      console.log("items", items);
      return { items: items, summary: summary, users: users };
    } catch (error) {
      console.error("Error retrieving the latest bill items:", error);
    }
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setIsLoading(true);
      setCapturedPhoto(photo.uri);

      setTimeout(async () => {
        const manipulatedPhoto = await compressImage(photo.uri);

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
          (snapshot) => {},
          (error) => {
            console.error("Error uploading image: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            setIsLoading(true);
            const unsubscribe = onSnapshot(
              doc(FIRESTORE, "users", userId),
              async (snapshot) => {
                const data = snapshot.data();
                if (data && data.uploaded) {
                  const billInformation = await retrieveLatestBillItems();
                  setIsLoading(false);
                  setBillData(billInformation);
                  setNavItems(true);
                  setCapturedPhoto(null);
                  unsubscribe();
                }
              }
            );
          }
        );
      }, 500);
    }
  };

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [isLoading]);

  const compressImage = async (uri) => {
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
    );

    const imageSizeInBytes = compressed.size;
    const imageSizeInMB = imageSizeInBytes / (1024 * 1024);

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
    right: 20,
    top: 20,
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
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 1000,
  },
});