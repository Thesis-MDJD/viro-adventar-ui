import React from "react";
import { StackNavigator, SwitchNavigator } from "react-navigation";
import Restaurants from "./components/Restaurants";
import Camera from "./components/Camera";
import LoginScreen from "./components/LoginScreen";
import AuthLoadingScreen from "./components/AuthLoadingScreen";

const AppStack= StackNavigator({ Restaurants: Restaurants, Camera: Camera});
const AuthStack = StackNavigator({ Login: LoginScreen });

export default SwitchNavigator (
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  }

)
