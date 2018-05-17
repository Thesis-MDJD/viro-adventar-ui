import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { firebaseApp } from "./FireBase";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      userId: "",
      email: "",
      loggedInUser: {},
      loading: true
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
    try {
      result.once("value", async snap => {
        let userAttributes = snap.val();
        self.setState({
          username: userAttributes.username,
          userId: userId,
          email: userAttributes.email,
          loggedInUser: {
            uid: await AsyncStorage.getItem("dbId"),
            email: await AsyncStorage.getItem("email"),
            username: await AsyncStorage.getItem("username")
          },
          loading: false
        });
      });
    } catch (error) {
      console.log("Fetching Current User Error: ", error);
    }
  };
  componentDidMount() {
    this.getUserProfile();
    this.props.navigation.setParams({
      goBackToPrevious: this.goBackToPrevious
    });
  }

  addFriend = async userId => {
    try {
      this.rootRef
        .child("Users")
        .child(userId)
        .child("Friends")
        .push()
        .set({
          status: 0,
          uid: this.state.loggedInUser.uid,
          email: this.state.loggedInUser.email,
          username: this.state.loggedInUser.username
        });
    } catch (error) {
      console.log("Add Friend Error: ", error);
    }
  };

  acceptFriend = uid => {
    const self = this;
    const loggedIn = this.state.loggedInUser;
    let loginUserId = loggedIn.uid;
    const request = this.rootRef
      .child("Users")
      .child(loggedIn.uid)
      .child("Friends")
      .orderByChild("uid")
      .equalTo(uid);
    request.once("value", snap => {
      snap.ref.remove();
      self.rootRef
        .child("Users")
        .child(loggedIn.uid)
        .child("Friends")
        .push()
        .set({
          status: 1,
          uid: self.state.userId,
          email: self.state.email,
          username: self.state.username
        });
      const newAdd = self.rootRef
        .child("Users")
        .child(loggedIn.uid)
        .child("Friends");
      newAdd.once("value", snap => {
        alert(`NewAdd ${snap.val()}`);
      });
    });
    this.rootRef
      .child("Users")
      .child(this.state.userId)
      .child("Friends")
      .push()
      .set({
        status: 1,
        uid: loggedIn.uid,
        email: loggedIn.email,
        username: loggedIn.username
      });
  };

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
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
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
            <Button
              onPress={this.goToFriends}
              title="My Friends"
              color="blue"
            />
            <Button
              onPress={this.goToPlaces}
              title="Favorite Places"
              color="blue"
            />
            <Button onPress={this.goToHistory} title="History" color="blue" />

            {!this.props.navigation.state.params.isRequested ? (
              this.props.navigation.state.params.isAccepted ? null : (
                <Button
                  onPress={() => {
                    this.addFriend(this.state.userId);
                  }}
                  title="Add Friend"
                  color="blue"
                />
              )
            ) : null}

            {this.props.navigation.state.params.isRequested ? (
              <Button
                onPress={() => {
                  this.acceptFriend(this.state.userId);
                }}
                title="Accept Friend"
                color="blue"
              />
            ) : null}
          </View>
        )}
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
