import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  TextInput
} from "react-native";
import { SearchBar, ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loggedInUser: this.props.navigation.state.params.loggedInUser,
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
    const msgContent = {
      content: this.state.text,
      conversation: this.props.navigation.state.params.convId,
      sender: this.state.loggedInUser.curUid,
      createdAt: Date.now()
    };
    const msg = this.rootRef.child("Messages").push();
    msg.set(msgContent);
    this.setState({
      text: ""
    });
  };

  getUserProfile = async () => {
    const self = this;
    const { convId } = this.props.navigation.state.params;
    const result = this.rootRef
      .child("Messages")
      .orderByChild("conversation")
      .equalTo(convId);
    result.on("child_added", snap => {
      const updateMessages = self.state.messages.slice();
      updateMessages.push(snap.val());
      self.setState({
        messages: updateMessages
      });
    });
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
        <Text>{this.state.participants}</Text>
        <List>
          <ScrollView>
            {this.state.messages.map(item => {
              return (
                <Text key={item.conversation}>
                  sender: {item.sender} conversation: {item.conversation}
                  content: {item.content}
                </Text>
              );
            })}
          </ScrollView>
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
