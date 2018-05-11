import React, { Component } from "react";
import { Text, View } from "react-native";
import { firebaseApp } from "./FireBase";

export default class FavoritePlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Mark",
      friends: []
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features")
      .child("Friends");
  }

  componentDidMount() {
    const self = this;
    this.rootRef.on("value", function(snapshot) {
      alert(JSON.stringify(snapshot.val()));
      // const values = [];
      // for (let key in snapshot.val()) {
      //   if (snapshot.val()[key] !== 'Mark') {
      //     values.push(snapshot.val()[key]);
      //   }
      // }
      // self.setState({
      //   friends: values
      // });
    });
  }

  componentWillUnmount() {
    this.rootRef.off();
  }
  render() {
    return (
      <View>
        {this.state.friends.map(place => {
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
