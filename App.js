import React from "react";
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

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="Login"
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
