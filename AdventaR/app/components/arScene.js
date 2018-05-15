"use strict";

import React, { Component, Text } from "react";

import {StyleSheet} from "react-native";

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroAnimations,
  Viro3DObject,
  ViroAmbientLight,
  ViroUtils,
  ViroNode,
  ViroSpinner,
  ViroFlexView
} from "react-viro";
import { DeviceEventEmitter } from "react-native";
import ReactNativeHeading from "react-native-heading";
import { withNavigation } from "react-navigation";
import getDegreesDistance from "./util/getDegreesDistance";

const polarToCartesian = ViroUtils.polarToCartesian;

class HelloWorldSceneAR extends Component {

  constructor(props) {
    super(props);

    // Set initial state here
    this.state = {
      text: "Initializing AR...",
      headingIsSupported: 0,
      places: this.props.arSceneNavigator.viroAppProps.places,
      longitude: this.props.arSceneNavigator.viroAppProps.longitude,
      latitude: this.props.arSceneNavigator.viroAppProps.latitude,
      initialized: false,
      expandedPlace: 0
    };
    this.filteredPlaces = [];

    this.heading = 0;
    this.cameraHead = 0.1;

    // bind "this" to functions
    this._onInitialized = this._onInitialized.bind(this);
    this.touched = this.touched.bind(this);
  }

  touched(id, behind = false) {
    let currentPlace = this.filteredPlaces.filter(place => place && place.id === id);
    if (currentPlace && currentPlace.length && currentPlace[0].locationsBehind && currentPlace[0].locationsBehind.length && behind) {
      this.setState({expandedPlace: id});
    } else {
      this.props.navigation.navigate("SelectedLocation", {restaurantId: id});
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return Object.assign(prevState, {
      places: nextProps.arSceneNavigator.viroAppProps.places,
      longitude: nextProps.arSceneNavigator.viroAppProps.longitude,
      latitude: nextProps.arSceneNavigator.viroAppProps.latitude,
    });
  }

  componentDidMount() {
    ReactNativeHeading.start(5)
      .then(didStart => {
        this.setState({
          headingIsSupported: didStart,
        });
      });
    
    DeviceEventEmitter.addListener("headingUpdated", data => {
      this.heading = data.heading || data;
    });
  }

  componentWillUnmount() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners("headingUpdated");
  }

  render() {
    this.filteredPlaces = this.state.places.slice(0, 20).map(place => {
      place.polarCoor = getDegreesDistance(parseFloat(this.state.latitude), parseFloat(place.coordinates.latitude), parseFloat(this.state.longitude), parseFloat(place.coordinates.longitude));
      place.locationsBehind = [];
      place.processed = false;
      return place;
    });
    this.filteredPlaces = this.filteredPlaces
      .map((place, index, array) => {
      if (place.processed) {
        return;
      }
      place.processed = true;
      for (let i = 0; i < array.length; i++) {
        if (!array[i].processed
          && i !== index
          && place.polarCoor.degrees > array[i].polarCoor.degrees - 10
          && place.polarCoor.degrees < array[i].polarCoor.degrees + 10) {
          place.locationsBehind.push(array[i]);
          array[i].processed = true;
        }
      }
      return place;
    })
      .filter(place => place);

    return (
      <ViroARScene ref={component => this.scene = component} onTrackingUpdated={this._onInitialized}>
        <ViroAmbientLight color="#FFFFFF" />
        {this.state.latitude === "" || !this.state.initialized || this.state.places.length === 0 ?
          (
            <ViroNode position={[0, 0, -1]}>
              <ViroText text={"Initializing AR..."} scale={[0.5, 0.5, 0.5]} />
              <ViroSpinner type='Light' scale={[0.5, 0.5, 0.5]} position={[0, -0.5, 0]} />
            </ViroNode>
          )
          :
          (this.filteredPlaces.map( (place, index) => {
            if (place && place.polarCoor) {
              let polarCoor = getDegreesDistance(parseFloat(this.state.latitude), parseFloat(place.coordinates.latitude), parseFloat(this.state.longitude), parseFloat(place.coordinates.longitude));
              let turn = polarCoor.degrees - this.cameraHead;
              return (
                <ViroNode
                  key={place.id}
                  rotation={[0, turn * -1, 0]}
                  position={polarToCartesian([75, turn, 0])}>
                  {!this.state.expandedPlace ?
                    [<ViroText onClick={() => this.touched(place.id)}
                               text={place.name + ',' + place.locationsBehind.length} scale={[15, 15, 15]}
                               position={[0, 3.5, 0]} style={styles.placeTextStyle}/>,
                      <Viro3DObject source={require('./res/OrangePeel_v4.vrx')}
                                    rotation={[0, 0, 0]}
                                    position={[0, -3.5, 0]}
                                    scale={[0.1, 0.1, 0.1]}
                                    onClick={() => this.touched(place.id, true)}
                                    type="VRX"
                                    animation={{name: 'animateMarker', run: true, loop: true}}/>]
                    : null
                  }
                  {this.state.expandedPlace && this.state.expandedPlace === place.id && place.locationsBehind ?
                    (
                      <ViroFlexView transformBehaviors={["billboard"]} style={styles.expandedPlaceContainer} height={2} width={0} scale={[10, 10, 10]} position={[0, 3.5, 30]}>
                        <ViroFlexView height={1} position={[0, 0, -10]} width={2} flex={.5} onClick={() => this.setState({expandedPlace: 0})}>
                          <ViroText height={1} textLineBreakMode={"wordwrap"} text={"Close"} style={styles.expandedLocationText}/>
                        </ViroFlexView>
                        {place.locationsBehind.map(location =>
                          (
                            <ViroFlexView height={1} position={[0, 0, -10]} width={3} flex={.5} onClick={() => this.touched(location.id)}>
                              <ViroText key={location.id} height={1} textLineBreakMode={"wordwrap"} text={location.name} style={styles.expandedLocationText}/>
                            </ViroFlexView>
                          )
                        )}
                      </ViroFlexView>
                    )
                      : null}
                </ViroNode>
              );
            }
          }))}

      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    if (state === ViroConstants.TRACKING_NORMAL) {
      if (this.cameraHead === 0.1) {
        this.cameraHead = this.heading;
      }

      this.setState({
        initialized: true
      });

    } else if (state === ViroConstants.TRACKING_UNAVAILABLE) {
      if (this.state.initialized) {
        this.setState({
          places: []
        }, () => {
          if (this.state.longitude !== "") {
            this.props.arSceneNavigator.viroAppProps.unmount();
          }
        });
      }
    }
  }
}

          
const styles = StyleSheet.create({
  placeTextStyle: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  expandedPlaceContainer: {
    flexDirection: 'column',
    backgroundColor: "#000000",
    padding: .2,
    justifyContent: "space-evenly"
  },
  expandedLocationText: {
    fontFamily: "Helvetica",
    fontSize: 16,
    color: "#ff0000"
  }
});

ViroAnimations.registerAnimations({
  animateMarker:{
    properties: {rotateY: '+=45'},
    duration: 1000
  }
});



export default withNavigation(HelloWorldSceneAR);