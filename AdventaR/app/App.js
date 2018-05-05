// import React, { Component } from "react";
// import { Platform, StyleSheet, Text, View } from "react-native";

// type Props = {};
// export default class App extends Component<Props> {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   render() {
//     return <Camera />;
//   }
// }

import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "react-navigation";
import Restaurants from "./components/Restaurants";
import Camera from "./components/Camera";

export default createStackNavigator(
  {
    Restaurants: {
      screen: Restaurants
    },
    Camera: {
      screen: Camera
    }
  },
  {
    initialRouteName: "Restaurants"
  }
);
