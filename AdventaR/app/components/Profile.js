import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  Modal,
  TouchableHighlight
} from "react-native";
import { firebaseApp } from "./FireBase";
import ProfilePicture from "./ProfilePicture";
import RNFetchBlob from "react-native-fetch-blob";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      dbId: "",
      email: "",
      modalVisible: false,
      profilePicture: undefined
    };

    this.setProfilePicture = this.setProfilePicture.bind(this);

    //Database
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
    //Load Profile
  }

  getUserProfile = async () => {
    const self = this;
    try {
      const username = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("email");
      const userId = await AsyncStorage.getItem("dbId");
      this.setState({
        username,
        dbId: userId,
        email
      }, () => {
        this.setProfilePicture();
      });
    } catch (error) {
      alert("error", JSON.stringify(error));
      console.log("Profile Fetch Error: ", error);
    }
  };

  componentDidMount() {
    this.getUserProfile();
  }

  setProfilePicture() {
    let data = "";
    let pictureStor = firebaseApp.storage().ref().child(this.state.dbId + "/profilePicture");

    pictureStor.getMetadata()
      .then((metadata) => {
        console.log(metadata);
        pictureStor.getDownloadURL().then( (url) => {
          let task = RNFetchBlob.fetch("GET", url)
            .then( (data) => {
              let string = data.data;
              let stringData = string.split(",").map( (item)=> {
                return String.fromCharCode(item);
              }).join("");
              this.setState({
                profilePicture: "data:" + metadata.contentType + ";base64," + stringData
              });
            });
        });
      })
      .catch( err => {
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

  onLogOutPress = async () => {
    await AsyncStorage.removeItem("userToken");
    this.props.navigation.navigate("Auth");
  };
  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={( () => this.setState({ modalVisible: false })).bind(this)}
        >
          <ProfilePicture setProfilePicture={this.setProfilePicture} hideModal={( () => this.setState({ modalVisible: false })).bind(this)} profPic={this.state.profilePicture} />
        </Modal>
        <View style={styles.centered}>
          <TouchableHighlight onPress={( () => this.setState({ modalVisible: true })).bind(this)}>
            <Image
              style={styles.image}
              source={{
                uri:
                  this.state.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg"
              }}
            />
          </TouchableHighlight>
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
        <Button onPress={this.onLogOutPress} title="Log Out" color="blue" />
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
