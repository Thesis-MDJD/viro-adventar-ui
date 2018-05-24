import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableHighlight,
  Keyboard
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AutogrowInput from "react-native-autogrow-input";
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
      username: this.state.loggedInUser.username,
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

  onInputSizeChange = () => {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd({ animated: false });
      }.bind(this)
    );
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
      <View style={styles.outer}>
        <ScrollView
          ref={ref => {
            this.scrollView = ref;
          }}
          style={styles.messages}
        >
          {this.state.messages.map((message, index) => {
            return message.sender === this.state.loggedInUser.curUid ? (
              <MessageBubble
                key={index}
                direction={"left"}
                text={message.content}
              />
            ) : (
              <View>
                <MessageBubble
                  key={index}
                  direction={"right"}
                  text={message.content}
                />
                <Text style={styles.messageSenderBottom}>
                  {message.username}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <InputBar
          onSendPressed={() => this.sendChat()}
          onSizeChange={() => this.onInputSizeChange()}
          onChangeText={text => this.setState({ text })}
          text={this.state.text}
        />
        <KeyboardSpacer />
      </View>
    );
  }
}

class InputBar extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.text === "") {
      this.autogrowInput.resetInputText();
    }
  }

  render() {
    return (
      <View style={styles.inputBar}>
        <AutogrowInput
          style={styles.textBox}
          ref={ref => {
            this.autogrowInput = ref;
          }}
          multiline={true}
          defaultHeight={30}
          onChangeText={text => this.props.onChangeText(text)}
          onContentSizeChange={this.props.onSizeChange}
          value={this.props.text}
        />
        <TouchableHighlight
          style={styles.sendButton}
          onPress={() => this.props.onSendPressed()}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class MessageBubble extends Component {
  render() {
    var leftSpacer =
      this.props.direction === "left" ? null : <View style={{ width: 70 }} />;
    var rightSpacer =
      this.props.direction === "left" ? <View style={{ width: 70 }} /> : null;

    var bubbleStyles =
      this.props.direction === "left"
        ? [styles.messageBubble, styles.messageBubbleLeft]
        : [styles.messageBubble, styles.messageBubbleRight];

    var bubbleTextStyle =
      this.props.direction === "left"
        ? styles.messageBubbleTextLeft
        : styles.messageBubbleTextRight;

    return (
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>{this.props.text}</Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  //ChatView

  outer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white"
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 3
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: "#66db30"
  },

  //MessageBubble

  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    flex: 1
  },

  messageBubbleLeft: {
    backgroundColor: "#d5d8d4"
  },

  messageBubbleTextLeft: {
    color: "black"
  },

  messageBubbleRight: {
    backgroundColor: "#66db30"
  },

  messageBubbleTextRight: {
    color: "white"
  },

  messageSenderBottom: {
    color: "black",
    fontSize: 5
  }
});
