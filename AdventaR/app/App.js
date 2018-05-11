import React from "react";
import { StackNavigator, SwitchNavigator, TabNavigator } from "react-navigation";
import Restaurants from "./components/Restaurants";
import Camera from "./components/Camera";
import LoginScreen from "./components/LoginScreen";
import AuthLoadingScreen from "./components/AuthLoadingScreen";
import YelpRestaurants from './components/YelpRestaurants';
import SelectedLocation from './components/SelectedLocation';
import SearchFriend from './components/SearchFriend';

const AppStack= StackNavigator({
  SearchFriend: {screen: SearchFriend},
  Camera: {
    screen: TabNavigator({
      Camera: {
        screen: Camera,
        navigationOptions:({ navigation }) => ({
          title: 'Camera',
        }),
      },
      YelpRestaurants: {
        screen: YelpRestaurants,
        navigationOptions:({ navigation }) => ({
          title: 'User',
        })
      },
    }, {
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        tabBarOptions: {
          style: {
            backgroundColor: "#f4511e"
          },
          labelStyle: {
            fontSize: 28,
            fontWeight: 'bold',
            paddingBottom: 10
          },
          activeTintColor: '#fff',
          inactiveTintColor: '#ffa589',
      }
    })
  },
  SelectedLocation: {
    screen: SelectedLocation
  }
});

const AuthStack = StackNavigator({ Login: LoginScreen });

export default SwitchNavigator (
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  }

)