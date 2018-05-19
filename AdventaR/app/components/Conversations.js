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
      result.on("child_added", async snap => {
        const room = {
          conversationId: snap.key,
          participants: snap.val()["people"]
        };
        let col = self.state.conversations;
        col.push(room);
        alert(JSON.stringify(col));
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
  makeNewConversation = () => {
    this.props.navigation.navigate("NewConvo", {
      loggedInUser: this.state.loggedInUser
    });
  };
  goToConversation = (id, people) => {
    this.props.navigation.navigate("chat", {
      convId: id,
      loggedInUser: this.state.loggedInUser,
      people
    });
  };
  render() {
    return (
      <View styles={loadingScreen.container}>
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
                        this.goToConversation(
                          item.conversationId,
                          item.participants
                        );
                      }}
                    />
                  );
                }}
                keyExtractor={item => item.img} // change to key later
              />
            </List>
            <Button
              onPress={this.makeNewConversation}
              title="My Friends"
              color="blue"
            />
          </View>
        ) : (
          <Text> Chat With Friends! </Text>
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
