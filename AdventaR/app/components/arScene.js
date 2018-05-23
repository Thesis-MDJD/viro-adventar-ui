"use strict";

import React, { Component, Text } from "react";
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
  ViroFlexView,
} from "react-viro";
import { DeviceEventEmitter, AsyncStorage, StyleSheet } from "react-native";
import ReactNativeHeading from "react-native-heading";
import { withNavigation } from "react-navigation";
import getDegreesDistance from "./util/getDegreesDistance";
import { firebaseApp } from "./FireBase";
import Advertisement from "./ad";

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
      expandedPlace: 0,
      favorited: {},
      checkedIn: {},
      ad: undefined
    };
    this.filteredPlaces = [];

    this.heading = 0;
    this.cameraHead = 0.1;

    // bind "this" to functions
    this._onInitialized = this._onInitialized.bind(this);
    this.touched = this.touched.bind(this);
    this.updateFavoritedLocations = this.updateFavoritedLocations.bind(this);
    this.updateCheckedInLocations = this.updateCheckedInLocations.bind(this);
    this.setAd = this.setAd.bind(this);

    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }

  touched(id, name, distance, behind = false) {
    let currentPlace = this.filteredPlaces.filter(place => place && place.id === id);
    if (currentPlace && currentPlace.length && currentPlace[0].locationsBehind && currentPlace[0].locationsBehind.length && behind) {
      this.setState({expandedPlace: id});
    } else {
      this.props.navigation.navigate("SelectedLocation", {restaurantId: id, name: name, distance: distance, updateFavoritedLocations: this.updateFavoritedLocations, updateCheckedInLocations: this.updateCheckedInLocations});
    }
  }

  setAd(ad) {
    this.setState({
      ad
    }, () => {
      alert(`changed to ${ad}`);
    });
  }

  getCheckedInLocations = async () => {
    try {
      const userId = await AsyncStorage.getItem("dbId");
      let CheckedInId = this.rootRef
        .child("Users")
        .child(userId)
        .child("CheckedInPlaces")
        .orderByChild("yelpId");
      CheckedInId.once("value", snapshot => {
        let storage = {};
        if (snapshot.val()) {
          let checkedInYelpId = Object.values(snapshot.val()).forEach( place => storage[place.yelpId] = place.yelpId );
          this.setState({checkedIn: storage});
        }
      });
    } catch (error) {
      console.log("Error on checked in fetch", error);
    }
  }

  updateCheckedInLocations(yelpId) {
    this.state.checkedIn[yelpId] ? delete this.state.checkedIn[yelpId] : this.state.checkedIn[yelpId] = yelpId;
    this.setState({
      checkedIn: Object.assign({}, this.state.checkedIn)
    });
  }

  getFavoritedLocations = async () => {
    try {
      const userId = await AsyncStorage.getItem("dbId");
      let favoritedId = this.rootRef
        .child("Users")
        .child(userId)
        .child("FavoritePlaces")
        .orderByChild("yelpId");
      favoritedId.once("value", snapshot => {
        let storage = {};
        if (snapshot.val()) {
          let favoritedYelpId = Object.values(snapshot.val()).forEach( place => storage[place.yelpId] = place.yelpId );
          this.setState({favorited: storage});
        }
      });
    } catch (error) {
      console.log("Error on favorite fetch", error);
    }
  }

  updateFavoritedLocations(yelpId) {
    this.state.favorited[yelpId] ? delete this.state.favorited[yelpId] : this.state.favorited[yelpId] = yelpId;
    this.setState({
      favorited: Object.assign({}, this.state.favorited)
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let ad = undefined;
    let closest = undefined;

    let sortedPlaces = nextProps.arSceneNavigator.viroAppProps.places.map( (place)=> {
      let polarCoord = getDegreesDistance(parseFloat(nextProps.arSceneNavigator.viroAppProps.latitude), parseFloat(place.coordinates.latitude), parseFloat(nextProps.arSceneNavigator.viroAppProps.longitude), parseFloat(place.coordinates.longitude));
      
      return Object.assign({}, place, {polarCoord});
    });
    
    sortedPlaces.sort(function(a, b) { 
      return a.polarCoord.distance - b.polarCoord.distance; 
    });
    for (let i = 0; i < sortedPlaces.length; i++) {
      if (sortedPlaces[i].polarCoord.distance < 20 && (sortedPlaces[i].name === "Starbucks" || sortedPlaces[i].name === "Ben & Jerry's")) {
        if (ad !== undefined && closest > sortedPlaces[i].polarCoord.distance) {
          ad = sortedPlaces[i].name;
          closest = a.polarCoord.distance;
        }
      }
    }

    return Object.assign(prevState, {
      places: sortedPlaces,
      longitude: nextProps.arSceneNavigator.viroAppProps.longitude,
      latitude: nextProps.arSceneNavigator.viroAppProps.latitude,
      ad
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
    this.getFavoritedLocations();
    this.getCheckedInLocations();
  }

  componentWillUnmount() {
    ReactNativeHeading.stop();
    DeviceEventEmitter.removeAllListeners("headingUpdated");
  }

  render() {
    let forceRerender = false;
    this.filteredPlaces = this.state.places.slice(0, 20).map(place => {
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
          && place.polarCoord.degrees > array[i].polarCoord.degrees - 10
          && place.polarCoord.degrees < array[i].polarCoord.degrees + 10) {
            place.locationsBehind.push(array[i]);
            array[i].processed = true;
          }
        }
        return place;
      })
      .filter(place => place);

    this.filteredPlaces.forEach( place => {
      if (place.id === this.state.expandedPlace && place.locationsBehind.length === 0) {
        forceRerender = true;
      }
    });

    return (
      <ViroARScene ref={component => this.scene = component} onTrackingUpdated={this._onInitialized}>
        <ViroAmbientLight color="#FFFFFF" />

        {/*Ads*/}
        <Advertisement place={this.state.ad} />

        {this.state.latitude === "" || !this.state.initialized || this.state.places.length === 0 ?
          (
            <ViroNode position={[0, 0, -1]}>
              <ViroText text={"Initializing AR..."} scale={[0.5, 0.5, 0.5]} />
              <ViroSpinner type='Light' scale={[0.5, 0.5, 0.5]} />
            </ViroNode>
          )
          :
          (this.filteredPlaces.map( (place, index) => {
            if (place && place.polarCoord) {
              let turn = place.polarCoord.degrees - this.cameraHead;

              let marker = place.locationsBehind.length > 0 ?
                require("./res/Square.vrx")
                :
                (this.state.favorited[place.id] && this.state.checkedIn[place.id]) ?
                  require("./res/CircledHeart.vrx")
                  :
                  this.state.favorited[place.id] ?
                    require("./res/Heart.vrx")
                    :
                    this.state.checkedIn[place.id] ?
                      require("./res/Circle.vrx")
                      :
                      require("./res/Triangle.vrx");

              let moreLocations = place.locationsBehind.length > 0 ?
                (<ViroText key={"2" + place.id} onClick={() => this.touched(place.id, place.name, place.polarCoord.distance)}
                  text={place.locationsBehind.length + " more"} scale={[15, 15, 15]}
                  position={[0, -1.5, 0]} style={styles.morePlaceTextStyle} />)
                :
                null;

              return (
                <ViroNode
                  key={place.id}
                  rotation={[0, turn * -1, 0]}
                  position={polarToCartesian([75, turn, 0])}>
                  {!this.state.expandedPlace || forceRerender ?
                    [<ViroText key={"1" + place.id} width={1.2} onClick={() => this.touched(place.id, place.name, place.polarCoord.distance)}
                      text={place.name} scale={[15, 15, 15]}
                      position={[0, 3.5, 0]} style={styles.placeTextStyle} shadowCastingBitMask={2} />,
                    moreLocations,
                    <Viro3DObject key={"3" + place.id} source={marker}
                      rotation={[0, 0, 0]}
                      position={[0, -4.5, 0]}
                      scale={[0.4, 0.4, 0.4]}
                      onClick={() => this.touched(place.id, place.name, place.polarCoord.distance, true)}
                      type="VRX"
                      animation={{name: "animateMarker", run: true, loop: true}}/>]
                    : null
                  }
                  {this.state.expandedPlace && this.state.expandedPlace === place.id && place.locationsBehind && place.locationsBehind.length > 0 ?
                    (
                      <ViroFlexView transformBehaviors={["billboard"]} style={styles.expandedPlaceContainer} height={2} width={0} scale={[10, 10, 10]} position={[0, 3.5, 30]}>
                        <ViroFlexView height={1} width={1} flex={.5} onClick={() => this.setState({expandedPlace: 0})} style={styles.expandedPlaceContainer}>
                          <ViroText height={1} textLineBreakMode={"wordwrap"} text={"Close"} style={styles.expandedLocationText}/>
                        </ViroFlexView>
                        {place.locationsBehind.slice(0, 5).map(location =>
                          (
                            <ViroFlexView height={1} width={3} flex={.5} onClick={() => this.touched(location.id, location.name, place.polarCoord.distance)} >
                              <ViroText key={location.id} height={1} textLineBreakMode={"wordwrap"} text={location.name} style={styles.expandedLocationText}/>
                            </ViroFlexView>
                          )
                        )}
                      </ViroFlexView>
                    )
                    : null
                  }
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
  morePlaceTextStyle: {
    fontFamily: "Helvetica",
    fontSize: 16,
    color: "#999999",
    textAlignVertical: "center",
    textAlign: "center",
  },
  expandedPlaceContainer: {
    flexDirection: "column",
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
  animateMarker: {
    properties: {rotateY: "+=45"},
    duration: 1000
  }
});


export default withNavigation(HelloWorldSceneAR);