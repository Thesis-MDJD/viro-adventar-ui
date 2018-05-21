import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";

export default class FavoritePlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Mark",
      requests: [],
      friends: [],
      loading: true
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }

  getUserProfile = async () => {
    const self = this;
    try {
      const username = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("email");
      const userId = await AsyncStorage.getItem("dbId");
      const friends = this.rootRef
        .child("Users")
        .child(userId)
        .child("Friends");
      friends.once("value", snap => {
        if (snap.val() !== null) {
          const connects = Object.values(snap.val());
          connects.forEach(connect => {
            if (connect.status === 0) {
              self.state.requests.push(connect);
            } else {
              self.state.friends.push(connect);
            }
          });
          self.setState({
            loading: false
          });
        } else {
          self.setState({
            loading: false
          });
        }
      });
    } catch (error) {
      console.log("Profile Fetch Error: ", error);
    }
  };

  componentDidMount() {
    this.getUserProfile();
  }

  goToSearch = () => {
    this.props.navigation.navigate("Search");
  };
  goToOtherProfile = (id, reqId, isRequested = false, isAccepted = false) => {
    this.props.navigation.navigate("otherProfile", {
      userId: id,
      reqId,
      isRequested,
      isAccepted
    });
  };
  // static navigationOptions = ({ navigation }) => {
  //   const params = navigation.state.params || {};
  //   return {
  //     title: "",
  //     headerStyle: {
  //       backgroundColor: "#f4511e"
  //     },
  //     headerTintColor: "#fff",
  //     headerTitleStyle: {
  //       fontWeight: "bold"
  //     },
  //     headerRight: (
  //       <Button onPress={params.goToSearch} title="Search" color="#fff" />
  //     )
  //   };
  // };
  componentWillUnmount() {
    this.rootRef.off();
  }
  render() {
    return (
      <View styles={loadingScreen.container}>
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <Button
              onPress={this.goToSearch}
              title="Search"
              color="black"
              style={styles.button}
            />
            {this.state.requests.length > 0 ? (
              <View>
                <Text>Friend Requests</Text>
                <List>
                  <FlatList
                    data={this.state.requests}
                    renderItem={({ item }) => {
                      return (
                        <ListItem
                          key={item.uid}
                          roundAvatar
                          title={item.username}
                          avatar={{ uri: item.image }}
                          onPress={() => {
                            this.goToOtherProfile(item.uid, item.reqId, true);
                          }}
                        />
                      );
                    }}
                    keyExtractor={item => item.image} // change to key later
                  />
                </List>
              </View>
            ) : null}
            <Text>Friends</Text>
            <List>
              <FlatList
                data={this.state.friends}
                renderItem={({ item }) => {
                  return (
                    <ListItem
                      key={item.uid}
                      roundAvatar
                      title={item.username}
                      avatar={{ uri: item.image }}
                      onPress={() => {
                        this.goToOtherProfile(item.uid, false, true);
                      }}
                    />
                  );
                }}
                keyExtractor={item => item.image} // change to key later
              />
            </List>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-end",
    marginTop: -5,
    position: "absolute"
  }
});

const loadingScreen = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
