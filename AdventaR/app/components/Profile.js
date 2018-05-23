import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  Modal,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Icon } from "react-native-elements";
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
      profilePicture: undefined,
      lastCheckedIn: null,
      checkedInCount: 0,
      favoritedCount: 0,
      friendCount: 0
    };

    this.setProfilePicture = this.setProfilePicture.bind(this);
    this.getLastCheckedIn = this.getLastCheckedIn.bind(this);
    this.getCheckedInCount = this.getCheckedInCount.bind(this);
    this.getFavoritedCount = this.getFavoritedCount.bind(this);
    this.getFriendCount = this.getFriendCount.bind(this);

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
      this.setState(
        {
          username,
          dbId: userId,
          email
        },
        () => {
          this.setProfilePicture();
          this.getLastCheckedIn();
          this.getCheckedInCount();
          this.getFavoritedCount();
          this.getFriendCount();
        }
      );
    } catch (error) {
      alert("error", JSON.stringify(error));
      console.log("Profile Fetch Error: ", error);
    }
  };

  getLastCheckedIn() {
    let lastCheckedIn = this.rootRef
      .child("Users")
      .child(this.state.dbId)
      .child("CheckedInPlaces")
      .orderByChild("createdAt")
      .limitToLast(1);

    lastCheckedIn.on("value", snapshot => {
      snapshot.val() !== null
        ? this.setState({
            lastCheckedIn: Object.values(snapshot.val())[0].name
          })
        : this.setState({ lastCheckedIn: null });
    });
  }

  getCheckedInCount() {
    let checkedIns = this.rootRef
      .child("Users")
      .child(this.state.dbId)
      .child("CheckedInPlaces");

    checkedIns.on("value", snapshot => {
      snapshot.val() !== null
        ? this.setState({ checkedInCount: Object.keys(snapshot.val()).length })
        : this.setState({ checkedInCount: 0 });
    });
  }

  getFavoritedCount() {
    let favorites = this.rootRef
      .child("Users")
      .child(this.state.dbId)
      .child("FavoritePlaces");

    favorites.on("value", snapshot => {
      snapshot.val() !== null
        ? this.setState({ favoritedCount: Object.keys(snapshot.val()).length })
        : this.setState({ favoritedCount: 0 });
    });
  }

  getFriendCount() {
    let friends = this.rootRef
      .child("Users")
      .child(this.state.dbId)
      .child("Friends");

    friends.on("value", snapshot => {
      snapshot.val() !== null
        ? this.setState({ friendCount: Object.keys(snapshot.val()).length })
        : this.setState({ friendCount: 0 });
    });
  }

  componentDidMount() {
    this.getUserProfile();
  }

  componentWillUnmount() {
    this.rootRef.off();
  }

  setProfilePicture() {
    let data = "";
    let pictureStor = firebaseApp
      .storage()
      .ref()
      .child(this.state.dbId + "/profilePicture");

    pictureStor
      .getMetadata()
      .then(metadata => {
        pictureStor.getDownloadURL().then(url => {
          let task = RNFetchBlob.fetch("GET", url).then(data => {
            let string = data.data;
            let stringData = string
              .split(",")
              .map(item => {
                return String.fromCharCode(item);
              })
              .join("");
            this.setState({
              profilePicture:
                "data:" + metadata.contentType + ";base64," + stringData
            });
          });
        });
      })
      .catch(err => {});
  }

  goToFriends = () => {
    this.props.navigation.navigate("Friends");
  };

  goToPlaces = () => {
    this.props.navigation.navigate("Places", {
      username: this.state.username,
      dbId: this.state.dbId
    });
  };

  goToHistory = () => {
    this.props.navigation.navigate("History", {
      username: this.state.username,
      dbId: this.state.dbId
    });
  };

  onLogOutPress = async () => {
    await AsyncStorage.removeItem("userToken");
    this.props.navigation.navigate("Auth");
  };

  askPermission() {
    const requestPermissions = async () => {
      let permissions = [];
      !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)) && permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)) && permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (permissions.length > 0) {
        try {
          const granted = await PermissionsAndroid.requestMultiple(permissions);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use all");
          } else {
            console.log("Read/Write permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
      
    };
    
    
    if (Platform.OS === "android") {
      requestPermissions();
    }
  }

  showProfile() {
    this.askPermission();
    this.setState({ modalVisible: true });
  }

  render() {
    const lastCheckedIn = this.state.lastCheckedIn ? (
      <Text style={styles.lastCheckedIn}>
        Last Check In At:
        <Text style={styles.lastCheckedInName}>
          {" "}
          {this.state.lastCheckedIn}
        </Text>
      </Text>
    ) : null;

    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={(() => this.setState({ modalVisible: false })).bind(
            this
          )}
        >
          <ProfilePicture
            setProfilePicture={this.setProfilePicture}
            hideModal={(() => this.setState({ modalVisible: false })).bind(
              this
            )}
            profPic={this.state.profilePicture}
          />
        </Modal>
<<<<<<< HEAD
        <View style={styles.imageContainer}>
          <TouchableOpacity
            onPress={(() => this.setState({ modalVisible: true })).bind(this)}
          >
=======
        <View style={styles.centered}>
          <TouchableHighlight onPress={this.showProfile.bind(this)}>
>>>>>>> fixing location update on ar
            <Image
              style={styles.image}
              source={{
                uri:
                  this.state.profilePicture ||
                  "https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg"
              }}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{this.state.username}</Text>
        </View>

        <View style={{ marginLeft: 20 }}>{lastCheckedIn}</View>

        <View style={styles.statsContainer}>
          <TouchableOpacity onPress={this.goToFriends}>
            <View style={styles.statContainer}>
              <View style={styles.stat}>
                <Text style={styles.statText}>{this.state.friendCount}</Text>
                <Icon
                  name="account-group"
                  type="material-community"
                  color="#3b5998"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToHistory}>
            <View style={styles.statContainer}>
              <View style={styles.stat}>
                <Text style={styles.statText}>{this.state.checkedInCount}</Text>
                <Icon
                  name="check-circle"
                  type="material-community"
                  color="#1aa85d"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.goToPlaces}>
            <View style={styles.statContainer}>
              <View style={styles.stat}>
                <Text style={styles.statText}>{this.state.favoritedCount}</Text>
                <Icon name="heart" type="material-community" color="#ff4f7d" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.logOutContainer}
            onPress={this.onLogOutPress}
          >
            <Icon
              name="logout-variant"
              type="material-community"
              color="54575b"
            />
            <View>
              <Text color="54575b">Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

let screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#F5FCFF"
  },
  name: {
    fontSize: 32,
    textAlign: "center",
    margin: 10
  },
  lastCheckedIn: {
    fontSize: 20
  },
  lastCheckedInName: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  image: {
    width: screenWidth / 1.5,
    height: screenWidth / 1.5,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#f4511e",
    borderRadius: 75
  },
  imageContainer: {
    paddingVertical: 8,
    alignItems: "center"
  },
  statsContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  statContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth / 4,
    height: screenWidth / 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 50,
    borderColor: "#f4511e"
  },
  stat: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  statText: {
    fontSize: 20
  },
  logOutContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth / 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#f4511e",
    padding: 8
  }
});
