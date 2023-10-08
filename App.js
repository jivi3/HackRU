import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BillCard from "./components/bill-card/bill-card";
import waves from "./assets/waves.png";
import NewBill from "./pages/newBill";
import HomeScreen from "./pages/home-view";
import LoginView from "./pages/login-view";
import CameraScan from "./pages/camera-scan.js";
import PickItems from "./pages/pick-items";
import SignUp from "./pages/sign-up";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Login"
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="NewBill" component={NewBill} />
          <Stack.Screen name="Login" component={LoginView} />
          <Stack.Screen name="CameraScan" component={CameraScan} />
          <Stack.Screen name="PickItems" component={PickItems} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
