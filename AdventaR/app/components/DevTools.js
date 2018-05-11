import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { firebaseApp } from "./FireBase";

export default class DevTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Mark",
      friends: []
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }

  addUser = () => {
    this.rootRef
      .child("Users")
      .push()
      .set({
        name: "Mark",
        email: "mark@gmail.com",
        firstName: "",
        lastName: "",
        favoritePlaces: {},
        visitHistory: {},
        friends: {}
      });
  };

  addFriend = () => {
    //Get the current user id
    const user = this.rootRef
      .child("Users")
      .orderByChild("name")
      .equalTo("Mark");
    const self = this;
    //Pass in the id of the friend to add
    //const friendId = something
    user.once("value", snap => {
      const friends = self.rootRef
        .child("Users")
        .child(Object.keys(snap.val())[0])
        .child("Friends");
      friends.push().set({
        //should be setting friends id
        askdfjhasdf: 0
      });
      friends.once("value", snap => {
        alert(JSON.stringify(snap));
      });
    });
  };

  //   <Button
  //     onPress={this.searchUser("Mark")}
  //     title="Find User"
  //     color="blue"
  //   />
  searchUser = username => {
    const result = this.rootRef
      .child("Users")
      .orderByChild("name")
      .startAt(username);

    result.once("value", snap => {
      alert(JSON.stringify(snap.val()));
    });
  };

  //   <Button
  //     onPress={this.startChatroom(["Mark", "Daniel", "Joo-ho", "David"])}
  //     title="Start Room"
  //     color="blue"
  //   />
  startChatroom = users => {
    const group = users.reduce(function(acc, cur) {
      acc[cur] = true;
      return acc;
    }, {});
    this.rootRef
      .child("Conversations")
      .push()
      .set(group);
  };

  getChatrooms = username => {
    const rooms = this.rootRef
      .child("Conversations")
      .orderByKey()
      .equalTo(username);
    rooms.once("value", snap => {
      alert(JSON.stringify(snap.val()));
    });
  };

  componentWillUnmount() {
    this.rootRef.off();
  }
  render() {
    return (
      <View>
        <Button onPress={this.addUser} title="Add User" color="blue" />
        <Button onPress={this.addFriend} title="Add Friend" color="blue" />
        <Button
          onPress={this.getChatrooms("Mark")}
          title="get rooms"
          color="blue"
        />
      </View>
    );
  }
}
