"use strict";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  PermissionsAndroid
} from "react-native";
import { ViroARSceneNavigator } from "react-viro";
import arScene from "./arScene";
import { VIRO_KEY, REST_SERVER_IP, REST_API_KEY } from "react-native-dotenv";
import getDegreesDistance from "./util/getDegreesDistance.js";

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      cameraMounted: true,
      latitude: "",
      longitude: "",
      places: [],
      permissionsGranted: false
    };

    this.remount = this.remount.bind(this);
    this.unmount = this.unmount.bind(this);
  }

  unmount() {
    this.setState(
      {
        cameraMounted: false
      },
      () => {
        setTimeout(this.remount, 1000);
      }
    );
  }

  remount() {
    this.setState({
      cameraMounted: true
    });
  }

  getPlaces = async () => {
    let data = await fetch(
      `http://${REST_SERVER_IP}/yelp/nearby?latitude=${
        this.state.latitude
      }&longitude=${this.state.longitude}&API_KEY=${REST_API_KEY}`
    );
    let result = await data.json();
    this.setState({
      places: result.businesses
    });
  };

  componentDidMount() {
    const requestPermissions = async () => {
      let permissions = [];
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )) &&
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      )) && permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (permissions.length > 0) {
        try {
          await PermissionsAndroid.requestMultiple(permissions);
          this.setState({
            permissionsGranted: true
          });
          this.setGPS();
        } catch (err) {
          console.warn(err);
        }
      } else {
        this.setState({
          permissionsGranted: true
        });
        this.setGPS();
      }
    };

    if (Platform.OS === "android") {
      requestPermissions();
    } else {
      this.setState({
        permissionsGranted: true
      });
      this.setGPS();
    }
  }

  setGPS() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        }, () => {
          this.getPlaces();
        });
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
        }, () => {
          if (position.speed <= 3 && getDegreesDistance(this.state.previousLatitude, position.coords.latitude, this.state.previousLongitude, position.coords.longitude).distance > 1000) {
            this.getPlaces();
          } else {
            this.setState({
              places: this.state.places.slice()
            });
          }
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: false,
        timeout: 200000,
        maximumAge: 1000,
        distanceFilter: 5
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.cameraMounted && this.state.permissionsGranted ? (
          <ViroARSceneNavigator
            apiKey={VIRO_KEY}
            ref={component => component}
            viroAppProps={{
              unmount: this.unmount,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              places: this.state.places
            }}
            initialScene={{ scene: arScene }}
            autofocus={false}
            debug={true} // set this to true
          />
        ) : (
          <Text style={styles.placeTextStyle}>Tracking lost...</Text>
        )}
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
  placeTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center"
  }
});
