import React from "react";
import { StackNavigator, SwitchNavigator } from "react-navigation";
import Restaurants from "./components/Restaurants";
import Camera from "./components/Camera";
import LoginScreen from "./components/LoginScreen";
import AuthLoadingScreen from "./components/AuthLoadingScreen";
import YelpRestaurants from './components/YelpRestaurants';
import SelectedLocation from './components/SelectedLocation';

const AppStack= StackNavigator({ Restaurants: Restaurants, Camera: Camera, YelpRestaurants: YelpRestaurants, SelectedLocation: SelectedLocation});
const AuthStack = StackNavigator({ Login: LoginScreen });

export default SwitchNavigator (
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  }

)