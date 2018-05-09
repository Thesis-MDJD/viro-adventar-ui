'use strict';

import React, { Component, Text } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroBox,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroUtils,
  ViroNode,
} from 'react-viro';
import { DeviceEventEmitter } from 'react-native';
import ReactNativeHeading from 'react-native-heading';
import { GOOGLE_API } from "react-native-dotenv";
import dummyData from "./res/dummyData";

const polarToCartesian = ViroUtils.polarToCartesian;

export default class HelloWorldSceneAR extends Component {

  constructor(props) {
    super(props);

    // Set initial state here
    this.state = {
      text : "Initializing AR...",
      headingIsSupported: 0,
      places: [],
      longitude: "",
      latitude: "",
      heading: 0,
      headingActual: 0,
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this.touched = this.touched.bind(this);
  }

  touched(index){
    return (position, source) => {
      let temp = this.state.places.slice();
      temp.splice(index, 1);
      this.setState({
        places: temp,
        headingActual: this.state.heading,
      });
    }
  }

  getPlaces = async (latitude, longitude) => {
    console.log('called!');
    this.setState({
      places: dummyData.results
    })
    // try {
    //   const data = await fetch(
    //     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${GOOGLE_API}`
    //   );
    //   const { results } = await data.json();
    //   this.setState({
    //     places: results
    //   });
    // } catch (error) {
    //   console.log("Fetch Error = ", error);
    // }
  };

  componentDidMount(){
    ReactNativeHeading.start(1)
    .then(didStart => {
      this.setState({
        headingIsSupported: didStart,
      })
    })
    
    DeviceEventEmitter.addListener('headingUpdated', data => {
      this.setState({
        heading: data
      }, () => {
        if(!this.state.headingActual){
          this.setState({
            headingActual: this.state.heading
          })
        }
      });
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
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
        this.getPlaces(position.coords.latitude, position.coords.longitude);
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 200000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );

    }

  componentWillUnmount() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners('headingUpdated');
    
    navigator.geolocation.clearWatch(this.watchId);
  }

  getDegreesDistance (lat1, lat2, lon1, lon2) {
    var R = 6371 * 1000; // Radius of the earth in m

    var dLat = (lat2-lat1) * Math.PI / 180;  // Javascript functions in radians
    var dLon = (lon2-lon1) * Math.PI / 180;
    
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c // Distance in m

    var y = Math.sin(lon2-lon1) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
    var brng = Math.atan2(y, x);
    
    return {degrees: (brng * 180 / Math.PI), distance: d};
  }

  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onInitialized} >
        <ViroAmbientLight color="#FFFFFF" />
        {this.state.places.map( (place, index) => {
          let polarCoor = this.getDegreesDistance(parseFloat(this.state.latitude), parseFloat(place.geometry.location.lat), parseFloat(this.state.longitude), parseFloat(place.geometry.location.lng)); 
          return (
            <ViroNode key={place.id} rotation={[0, this.state.headingActual - polarCoor.degrees, 0]} position={polarToCartesian([75, polarCoor.degrees - this.state.headingActual, 0])}>
              <ViroText text={(place.name).toString()} scale={[15, 15, 15]} position={[0, 2.5, 0]} style={styles.helloWorldTextStyle} />
              <Viro3DObject source={require('./res/model.vrx')}
                rotation={[90, 0, 90]}
                position={[0, -2.5, 0]}
                scale={[2.5, 2.5, 2.5]}
                onClick={this.touched(index)}
                degrees={polarCoor.degrees}
                type="VRX"
                animation={{name:'Take 001',
                            run:true,
                            loop:true}}
              />
            </ViroNode>
          )
        })}
        
      </ViroARScene>
    );
  }

  _onInitialized(state, reason) {
    console.log(this.state.headingActual);
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello World!",
        headingActual: this.state.heading
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      console.log('loss of tracking');
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./res/grid_bg.jpg'),
  },
});

module.exports = HelloWorldSceneAR;