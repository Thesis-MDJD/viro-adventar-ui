"use strict";

import React, { Component, Text } from "react";

import {StyleSheet} from "react-native";

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroUtils,
  ViroNode,
  ViroSpinner,
} from "react-viro";
import { DeviceEventEmitter, Platform } from "react-native";
import ReactNativeHeading from "react-native-heading";
import { withNavigation } from "react-navigation";
import getDegreesDistance from "./util/getDegreesDistance";

const polarToCartesian = ViroUtils.polarToCartesian;

class HelloWorldSceneAR extends Component {
  
  constructor(props) {
    super(props);

    // Set initial state here
    this.state = {
      text : "Initializing AR...",
      headingIsSupported: 0,
      places: this.props.arSceneNavigator.viroAppProps.places,
      longitude: this.props.arSceneNavigator.viroAppProps.longitude,
      latitude: this.props.arSceneNavigator.viroAppProps.latitude,
      initialized: false
    };

    this.heading = 0;
    this.cameraHead = 0.1;

    // bind "this" to functions
    this._onInitialized = this._onInitialized.bind(this);
    this.touched = this.touched.bind(this);
  }
  
  touched(id){
    this.props.navigation.navigate("SelectedLocation", {restaurantId: id});
  }

  static getDerivedStateFromProps(nextProps, prevState){
    return Object.assign(prevState, {
      places: nextProps.arSceneNavigator.viroAppProps.places,
      longitude: nextProps.arSceneNavigator.viroAppProps.longitude,
      latitude: nextProps.arSceneNavigator.viroAppProps.latitude,
    });
  }

  componentDidMount(){
    ReactNativeHeading.start(5)
    .then(didStart => {
      this.setState({
        headingIsSupported: didStart,
      });
    })
    
    DeviceEventEmitter.addListener("headingUpdated", data => {
      this.heading = data.heading || data;
    });
  }

  componentWillUnmount() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners("headingUpdated");
  }

  render() {

    return (
      <ViroARScene ref={component => this.scene = component} onTrackingUpdated={this._onInitialized} displayPointCloud={true}>
        <ViroAmbientLight color="#FFFFFF" />
        {this.state.latitude === "" || !this.state.initialized || this.state.places.length === 0 ? 
        ( 
          <ViroNode position={[0, 0, -1]}>
            <ViroText text={"Initializing AR..."} scale={[0.5, 0.5, 0.5]} />
            <ViroSpinner type="Light" scale={[0.5, 0.5, 0.5]} position={[0, -0.5, 0]} />
          </ViroNode>
        )
         :
        (this.state.places.map( (place, index) => {
          if(index < 20){
            let polarCoor = getDegreesDistance(parseFloat(this.state.latitude), parseFloat(place.coordinates.latitude), parseFloat(this.state.longitude), parseFloat(place.coordinates.longitude));
            let turn = polarCoor.degrees - this.cameraHead;
            return (
              <ViroNode
                key={place.id}
                rotation={[0, turn * -1, 0]}
                position={polarToCartesian([75, turn, 0])}>
                <ViroText text={place.name} scale={[15, 15, 15]} position={[0, 3.5, 0]} style={styles.helloWorldTextStyle} />
                <Viro3DObject source={require("./res/model.vrx")}
                  rotation={[90, 0, 90]}
                  position={[0, -3.5, 0]}
                  scale={[2.5, 2.5, 2.5]}
                  onClick={() => this.touched(place.id)}
                  type="VRX"
                  animation={{name:"Take 001",
                              run:true,
                              loop:true}}
                />
                  {/*some image with drop down*/}
              </ViroNode>
            )
          } else {
            return;
          }
        }))}
        
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      if(this.cameraHead === 0.1){
        this.cameraHead = this.heading;
      }

      this.setState({
        initialized: true
      })

    } else if (state == ViroConstants.TRACKING_UNAVAILABLE) {
      if(this.state.initialized){
        this.setState({
          places: []
        }, () => {
          if(this.state.longitude !== ""){
            this.props.arSceneNavigator.viroAppProps.unmount();
          }
        });
      }
    }
  }
}

          
var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require("./res/grid_bg.jpg"),
  },
});

export default withNavigation(HelloWorldSceneAR);