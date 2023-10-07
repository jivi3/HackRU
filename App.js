import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  ScrollView,
  StatusBar,
  Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BillCard from "./components/bill-card/bill-card";
import waves from "./assets/waves.png";
import NewBill from "./pages/newBill";
import HomeScreen from "./pages/home-view";
import LoginView from "./pages/login-view";
import CameraScan from "./pages/camera-scan.js"

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
    headerShown: false}} initialRouteName="Login">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NewBill" component={NewBill} />
        <Stack.Screen name="Login" component={LoginView} />
        <Stack.Screen name="CameraScan" component={CameraScan} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;