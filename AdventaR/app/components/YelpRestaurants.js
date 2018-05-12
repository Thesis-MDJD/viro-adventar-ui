import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button
} from "react-native";
import { YELP_API_KEY } from "react-native-dotenv";

export default class YelpRestaurants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: "",
      longitude: "",
      error: "",
      places: {}
    };
  }
  

getPlaces = async (latitude, longitude) => {
  let myHeaders = new Headers({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + YELP_API_KEY,
  });
  try {
    const data = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=restaurant&latitude=${latitude}&longitude=${longitude}&rank_by=distance&limit=50`,
      { headers: myHeaders }
    );
    const results = await data.json();
    this.setState({ places: results })
  } catch (error) {
    console.log("Fetch Error = ", error);
  }
};

  componentDidMount() {
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
    this.props.navigation.setParams({ goToRestaurants: this.goToRestaurants });
  }

  goToSelectedRestaurants(id) {
    this.props.navigation.navigate("SelectedLocation", {restaurantId: id});
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>{this.state.latitude}</Text>
        <Text style={styles.instructions}>{this.state.longitude}</Text>
        <ScrollView style={list.container}>
          {this.state.places.businesses ? this.state.places.businesses.map(place => {
            return (
              <Text style={list.item} key={place.id} onPress={() => this.goToSelectedRestaurants(place.id)}>
                {place.name}
              </Text>
            );
          }) : null }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

const list = StyleSheet.create({
  container: {
    paddingTop: 22,
    height: 10
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
