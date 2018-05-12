import React, { Component } from "react";
import { Text, View } from "react-native";
import { firebaseApp } from "./FireBase";

export default class FavoritePlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      places: []
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features")
      .child("Users")
      .child("Mark")
      .child("FavoritePlaces");
  }

  componentDidMount() {
    const self = this;
    this.rootRef.on("value", function(snapshot) {
      const values = [];
      for (let key in snapshot.val()) {
        values.push(snapshot.val()[key]);
      }
      self.setState({
        places: values
      });
    });
  }

  componentWillUnmount() {
    this.rootRef.off();
  }
  render() {
    return (
      <View>
        {this.state.places.map(place => {
          return (
            <View key={place.yelpId}>
              <Text> {place.Name} </Text>
              <Text> {place.Rating} </Text>
            </View>
          );
        })}
      </View>
    );
  }
}

// See what my favorite places are

// - Select favorite places from users where user is username
