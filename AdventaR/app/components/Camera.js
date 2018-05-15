"use strict";
import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ViroARSceneNavigator } from "react-viro";
import arScene from "./arScene";
import dummyData from "./res/dummyData";
import {VIRO_KEY} from "react-native-dotenv";
import getDegreesDistance from "./util/getDegreesDistance.js";

export default class Camera extends Component {
  constructor(props){
    super(props);

    this.state = {
      cameraMounted: true,
      latitude: "",
      longitude: "",
      places: [],
    }

    this.remount = this.remount.bind(this);
    this.unmount = this.unmount.bind(this);
  }

  unmount(){
    this.setState({
      cameraMounted: false
    }, ()=> {
      setTimeout(this.remount, 1000);
    })
  }

  remount(){
    this.setState({
      cameraMounted: true
    })
  }

  getPlaces = async (latitude, longitude) => {
    console.log("GET PLACES WAS CALLED");
    this.setState({
      places: dummyData.businesses,
      previousLatitude:latitude,
      previousLongitude: longitude,
    });
  };

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        this.getPlaces(position.coords.latitude, position.coords.longitude);
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );

    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });

        if(position.speed <= 3 && getDegreesDistance(this.state.previousLatitude, position.coords.latitude, this.state.previousLongitude, position.coords.longitude).distance > 1000){
          this.getPlaces(position.coords.latitude, position.coords.longitude);
        }
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: false,
        timeout: 200000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }

  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.cameraMounted ? (
        <ViroARSceneNavigator
          apiKey={VIRO_KEY}
          ref={((component)=> component).bind(this)}
          viroAppProps={{unmount: this.unmount, latitude: this.state.latitude, longitude: this.state.longitude, places: this.state.places}}
          initialScene={{scene: arScene}}
          autofocus={false}
          debug={true} // set this to true
        />) 
        : 
        <Text style={styles.helloWorldTextStyle}>Tracking lost...</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center"
  }
});
