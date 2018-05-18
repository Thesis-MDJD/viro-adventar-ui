import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  TextInput
} from "react-native";
import { SearchBar, ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loggedInUser: {},
      loading: true,
      newChat: false,
      text: ""
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }
  componentDidMount() {
    this.props.navigation.setParams({
      goBackToPrevious: this.goBackToPrevious
    });
    this.getUserProfile();
  }
  goBackToPrevious = () => {
    this.props.navigation.goBack();
  };
  sendChat = () => {
    this.rootRef
      .child("Messages")
      .push()
      .set({
        content: this.state.text,
        conversation: this.props.navigation.state.params.convId,
        sender: this.state.loggedInUser.curUid,
        createdAt: Date.now()
      });
    this.setState({
      text: ""
    });
  };
  getUserProfile = async () => {
    const self = this;
    try {
      const curUid = await AsyncStorage.getItem("dbId");
      const { convId } = this.props.navigation.state.params;
      const result = this.rootRef
        .child("Messages")
        .orderByChild("conversation")
        .equalTo(convId);
      // result.once("value", async snap => {
      //   const messages = Object.values(snap.val());
      //   if (messages) {
      //     self.setState({
      //       messages,
      // loggedInUser: {
      //   curUid,
      //   email: await AsyncStorage.getItem("email"),
      //   username: await AsyncStorage.getItem("username")
      // },
      //       loading: false
      //     });
      //   } else {
      //     self.setState({
      //       loggedInUser: {
      //         curUid,
      //         email: await AsyncStorage.getItem("email"),
      //         username: await AsyncStorage.getItem("username")
      //       },
      //       loading: false
      //     });
      //   }
      // });
      result.on("child_added", snap => {
        const updateMessages = self.state.messages.slice();
        updateMessages.push(snap.val());
        self.setState({
          loggedInUser: {
            curUid
          },
          loading: false,
          messages: updateMessages
        });
      });
    } catch (error) {
      console.log("Fetching Current User Error: ", error);
    }
  };
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: params.people,
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
      <View styles={loadingScreen.container}>
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <Text>{this.state.participants}</Text>
            <List>
              <FlatList
                data={this.state.messages}
                renderItem={({ item }) => {
                  return (
                    <Text key={item.conversation}>
                      sender: {item.sender} conversation: {item.conversation}
                      content: {item.content}
                    </Text>
                  );
                }}
              />
            </List>
            <View>
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={text => this.setState({ text })}
                onSubmitEditing={this.sendChat}
                returnKeyType="send"
                value={this.state.text}
              />
            </View>
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
