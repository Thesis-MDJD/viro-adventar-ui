import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  ActivityIndicator,
  FlatList
} from "react-native";
import { SearchBar, ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";

export default class Conversations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      loggedInUser: {},
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
      const curUid = await AsyncStorage.getItem("dbId");
      const result = this.rootRef
        .child("Conversations")
        .orderByChild(curUid)
        .equalTo(true);
      let col = [];
      result.once("value", async snap => {
        Object.keys(snap.val()).forEach(key => {
          col.push({ conversationId: key });
        });
        Object.values(snap.val()).forEach((room, i) => {
          col[i]["participants"] = room.name;
        });
        self.setState({
          conversations: col,
          loggedInUser: {
            curUid,
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
  }
  goToConversation = id => {
    alert(`working ${id}`);
  };
  render() {
    return (
      <View styles={loadingScreen.container}>
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
          <View>
            {this.state.conversations.length > 0 ? (
              <View>
                <Text>Conversations</Text>
                <List>
                  <FlatList
                    data={this.state.conversations}
                    renderItem={({ item }) => {
                      return (
                        <ListItem
                          key={item.conversationId}
                          title={item.participants}
                          onPress={() => {
                            this.goToConversation(item.conversationId);
                          }}
                        />
                      );
                    }}
                    keyExtractor={item => item.img} // change to key later
                  />
                </List>
              </View>
            ) : null}
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
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
