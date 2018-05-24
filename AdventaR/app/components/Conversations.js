import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  AsyncStorage,
  FlatList
} from "react-native";
import { ListItem, List } from "react-native-elements";
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
      this.setState(
        {
          loggedInUser: {
            curUid: await AsyncStorage.getItem("dbId"),
            email: await AsyncStorage.getItem("email"),
            username: await AsyncStorage.getItem("username")
          }
        },
        () => {
          self.loadConversations(self.state.loggedInUser.curUid);
        }
      );
    } catch (error) {
      console.log("Fetching Current User Error: ", error);
    }
  };

  loadConversations = curUid => {
    const self = this;
    const result = this.rootRef
      .child("Conversations")
      .orderByChild(curUid)
      .equalTo(true);
    result.once("value", snap => {
      if (!snap.val()) {
        self.setState({
          loading: false
        });
      } else {
        result.on("child_added", snap => {
          alert(JSON.stringify(snap.val()));
          if (snap.val()) {
            const room = {
              conversationId: snap.key,
              participants: snap.val()["people"]
            };
            let col = self.state.conversations;
            col.push(room);
            self.setState({
              conversations: col,
              loading: false
            });
          } else {
            self.setState({
              loading: false
            });
          }
        });
      }
    });
  };
  componentDidMount() {
    this.getUserProfile();
  }
  makeNewConversation = () => {
    this.props.navigation.navigate("NewConvo", {
      loggedInUser: this.state.loggedInUser,
      updateConversation: () => {
        this.loadConversations(this.state.loggedInUser.curUid);
      }
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
        {!this.state.loading ? (
          <View>
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
                keyExtractor={item => item.image} // change to key later
              />
            </List>
            <Button
              onPress={this.makeNewConversation}
              title="New Conversation"
              color="blue"
            />
          </View>
        ) : (
          <ActivityIndicator />
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
