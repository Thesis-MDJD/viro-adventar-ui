import React from "react";
import { createStackNavigator, SwitchNavigator } from "react-navigation";
import Restaurants from "./components/Restaurants";
import Camera from "./components/Camera";
import LoginScreen from "./components/LoginScreen";
import AuthLoadingScreen from "./components/AuthLoadingScreen";
import Profile from "./components/Profile";
import Friends from "./components/Friends";
import FavoritePlaces from "./components/FavoritePlaces";
export default createStackNavigator({
  Restaurants: Restaurants,
  Camera: Camera,
  Profile: Profile,
  Friends: Friends,
  Places: FavoritePlaces
});
const AuthStack = createStackNavigator({ Login: LoginScreen });

// export default SwitchNavigator (
//   {
//     AuthLoading: AuthLoadingScreen,
//     App: AppStack,
//     Auth: AuthStack
//   }

// )
