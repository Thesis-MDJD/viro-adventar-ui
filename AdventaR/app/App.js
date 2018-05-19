import React from "react";
import {
  createStackNavigator,
  SwitchNavigator,
  TabNavigator
} from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import Camera from "./components/Camera";
import LoginScreen from "./components/LoginScreen";
import AuthLoadingScreen from "./components/AuthLoadingScreen";
import YelpRestaurants from "./components/YelpRestaurants";
import SelectedLocation from "./components/SelectedLocation";
import Profile from "./components/Profile";
import DevTools from "./components/DevTools";
import SearchFriend from "./components/SearchFriend";
import OtherProfile from "./components/OtherProfile";
import Friends from "./components/Friends";
import Conversations from "./components/Conversations";
import Chat from "./components/Chat";
const AppStack = createStackNavigator({
  Camera: {
    screen: TabNavigator(
      {
        Camera: Camera,
        User: Profile,
        Friend: Friends,
        Convo: Conversations
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
          showIcon: true,
          activeTintColor: "#f4511e",
          activeBackgroundColor: "#f5f5f5",
          inactiveTintColor: "#999999",
          inactiveBackgroundColor: "#f5f5f5",
          style: {
            backgroundColor: "#f5f5f5"
          }
        }
      }
    ),
    navigationOptions: {
      header: null
    }
  },
  SelectedLocation: {
    screen: SelectedLocation
  },
  otherProfile: {
    screen: OtherProfile
  },
  Search: SearchFriend,
  chat: Chat
});

const AuthStack = createStackNavigator({ Login: LoginScreen });

export default SwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppStack,
  Auth: AuthStack
});
