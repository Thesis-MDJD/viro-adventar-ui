import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage
} from "react-native";
import { firebaseApp } from "./FireBase";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userId: "",
      email: ""
    };
    //Database
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
    //Load Profile
  }

  getUserProfile = async () => {
    const self = this;
    const { userId } = this.props.navigation.state.params;
    const result = this.rootRef.child("Users").child(userId);

    result.once("value", snap => {
      let userAttributes = snap.val();
      self.setState({
        username: userAttributes.username,
        userId: userId,
        email: userAttributes.email
      });
    });
  };
  componentDidMount() {
    this.getUserProfile();
    this.props.navigation.setParams({
      goBackToPrevious: this.goBackToPrevious
    });
  }

  goToFriends = () => {
    this.props.navigation.navigate("Friends");
  };

  goToPlaces = () => {
    this.props.navigation.navigate("Places");
  };

  goToHistory = () => {
    this.props.navigation.navigate("History");
  };
  goBackToPrevious = () => {
    this.props.navigation.goBack();
  };
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "",
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerLeft: (
        <Button onPress={params.goBackToPrevious} title="Back" color="#fff" />
      )
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Image
            style={styles.image}
            source={{
              uri:
                "https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg"
            }}
          />
          <Text style={styles.name}>{this.state.username}</Text>
        </View>
        <View style={{ marginLeft: 20 }}>
          <Text style={{ fontSize: 20 }}>Last Check In At:</Text>
        </View>
        <Button onPress={this.goToFriends} title="My Friends" color="blue" />
        <Button
          onPress={this.goToPlaces}
          title="Favorite Places"
          color="blue"
        />
        <Button onPress={this.goToHistory} title="History" color="blue" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  name: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  image: {
    width: 175,
    height: 175,
    marginTop: 20
  },
  centered: {
    alignItems: "center"
  }
});
