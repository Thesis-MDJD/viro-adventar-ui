import React from "react";
import {
  StackNavigator,
  SwitchNavigator,
  TabNavigator
} from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import Restaurants from "./components/Restaurants";
import Camera from "./components/Camera";
import LoginScreen from "./components/LoginScreen";
import AuthLoadingScreen from "./components/AuthLoadingScreen";
import YelpRestaurants from "./components/YelpRestaurants";
import SelectedLocation from "./components/SelectedLocation";
import Profile from "./components/Profile";
import DevTools from "./components/DevTools";
import SearchFriend from "./components/SearchFriend";
const AppStack = StackNavigator({
  Camera: {
    screen: TabNavigator(
      {
        Camera: Camera,
        User: Profile,
        Friend: SearchFriend,
        Convo: YelpRestaurants
      },
      {
        tabBarPosition: "bottom",
        swipeEnabled: true,
        navigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            let iconName;
            if (routeName === "Camera") {
              iconName = `ios-camera${focused ? "" : "-outline"}`;
            } else if (routeName === "User") {
              iconName = `ios-home${focused ? "" : "-outline"}`;
            } else if (routeName === "Friend") {
              iconName = `ios-people${focused ? "" : "-outline"}`;
            } else if (routeName === "Convo") {
              iconName = `ios-text${focused ? "" : "-outline"}`;
            }
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          }
        }),
        tabBarOptions: {
          activeTintColor: "white",
          activeBackgroundColor: "green",
          inactiveTintColor: "black",
          inactiveBackgroundColor: "green"
        }
      }
    ),
    navigationOptions: {
      header: null
    }
  },
  SelectedLocation: {
    screen: SelectedLocation
  }
});

const AuthStack = StackNavigator({ Login: LoginScreen });

export default SwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppStack,
  Auth: AuthStack
});

//rebase
