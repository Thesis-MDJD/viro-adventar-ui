import React, { Component } from "react";
import { Text, View } from "react-native";
import { firebaseApp } from "./FireBase";

const rootRef = firebaseApp.database().ref();
const itemsRef = rootRef.child("items");

export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }
  getRef = () => {
    return firebaseApp.database().ref();
  };

  listenForItems = itemsRef => {
    itemsRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: items
      });
    });
  };

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([{ title: "Pizza" }])
    });
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}
