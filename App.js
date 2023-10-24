import React from "react";
import { useEffect, useState } from "react";
import HomeScreen from "./pages/home-view";
import LoginView from "./pages/login-view";
import CameraScan from "./pages/camera-scan.js";
import PickItems from "./pages/pick-items";
import SignUp from "./pages/sign-up";
import Payment from "./pages/payment-view";
import AddFriends from "./pages/add-friends";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "react-query";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, View } from "react-native";
import { FIREBASE_AUTH } from "./firebaseConfig";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up the listener for authentication state
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      console.log("Auth state changed. Current user is:", authUser);
      if (authUser) {
        // User is logged in
        console.log("User details:", authUser);
        // setUser(authUser);
      } else {
        // User is logged out
        console.log("No user is logged in.");
        // setUser(null);
      }
      setIsLoading(false);
    });

    // Unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // We haven't finished checking for the user's auth state yet
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={user ? "HomeScreen" : "Login"}
          >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginView} />
            <Stack.Screen name="CameraScan" component={CameraScan} />
            <Stack.Screen name="PickItems" component={PickItems} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="AddFriends" component={AddFriends} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
