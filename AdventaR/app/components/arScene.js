'use strict';

import React, { Component, Text } from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroCamera,
  ViroText,
  ViroConstants,
  ViroMaterials,
  Viro3DObject,
  ViroAmbientLight,
  ViroUtils,
  ViroNode,
  ViroSpinner,
  ViroARSceneNavigator,
} from 'react-viro';
import { DeviceEventEmitter, Platform } from 'react-native';
import ReactNativeHeading from 'react-native-heading';
import dummyData from "./res/dummyData";
import { withNavigation } from 'react-navigation'

const polarToCartesian = ViroUtils.polarToCartesian;

class HelloWorldSceneAR extends Component {

  constructor(props) {
    super(props);

    // Set initial state here
    this.state = {
      text : "Initializing AR...",
      headingIsSupported: 0,
      places: [],
      longitude: "",
      latitude: "",
    };

    this.heading = 0;

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this.touched = this.touched.bind(this);
    this.cameraHead = 0.1;
  }

  touched(id){
    this.props.navigation.navigate("SelectedLocation", {restaurantId: id});
  }

  getPlaces = async (latitude, longitude) => {
    this.setState({
      places: dummyData.businesses
    })
  };

  // popARScene() {
  //   this.props.arSceneNavigator.pop()
  // }

  componentDidMount(){
    ReactNativeHeading.start(2)
    .then(didStart => {
      this.setState({
        headingIsSupported: didStart,
      })
    })
    
    DeviceEventEmitter.addListener('headingUpdated', data => {
      this.heading = data.heading || data;
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
        enableHighAccuracy: false,
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
    
    return {degrees: ((brng * 180 / Math.PI) + 360) % 360, distance: d};
  }

  render() {
    return (
      <ViroARScene ref={component => this.scene = component} onTrackingUpdated={this._onInitialized} displayPointCloud={true}>
        <ViroAmbientLight color="#FFFFFF" />
        {this.state.latitude === "" || (this.state.initialized && this.state.places.length === 0) ? 
        ( 
          <ViroNode position={[0, 0, -1]}>
            <ViroText text={"Initializing AR..."} scale={[0.5, 0.5, 0.5]} />
            <ViroSpinner type='Light' scale={[0.5, 0.5, 0.5]} position={[0, -0.5, 0]} />
          </ViroNode>
        )
         :
        (this.state.places.map( (place, index) => {
          if(index < 20){
            let polarCoor = this.getDegreesDistance(parseFloat(this.state.latitude), parseFloat(place.coordinates.latitude), parseFloat(this.state.longitude), parseFloat(place.coordinates.longitude));
            let turn = polarCoor.degrees - this.cameraHead;
            return (
              <ViroNode
                key={place.id}
                rotation={[0, turn * -1, 0]}
                position={polarToCartesian([75, turn, 0])}>
                <ViroText text={place.name} scale={[15, 15, 15]} position={[0, 2.5, 0]} style={styles.helloWorldTextStyle} />
                <Viro3DObject source={require('./res/model.vrx')}
                  rotation={[90, 0, 90]}
                  position={[0, -2.5, 0]}
                  scale={[2.5, 2.5, 2.5]}
                  onClick={() => this.touched(place.id)}
                  degrees={polarCoor.degrees}
                  type="VRX"
                  animation={{name:'Take 001',
                              run:true,
                              loop:true}}
                />
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

    } else if (state == ViroConstants.TRACKING_UNAVAILABLE) {
      if(this.state.places.length > 0){
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
    fontFamily: 'Helvetica',
    fontSize: 20,
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

export default withNavigation(HelloWorldSceneAR);