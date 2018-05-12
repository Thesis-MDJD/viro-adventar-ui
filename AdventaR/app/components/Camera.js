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
import {VIRO_KEY} from "react-native-dotenv";

export default class Camera extends Component {
  constructor(props){
    super(props);

    this.state = {
      cameraMounted: true
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

  render() {
    return (
      <View style={styles.container}>
        {this.state.cameraMounted ? (<ViroARSceneNavigator
          apiKey={VIRO_KEY}
          ref={((component)=> component).bind(this)}
          viroAppProps={{unmount: this.unmount}}
          initialScene={{scene: arScene}}
          autofocus={false}
          debug={true} // set this to true
        />) : <Text style={styles.helloWorldTextStyle}>Tracking lost...</Text>}
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
