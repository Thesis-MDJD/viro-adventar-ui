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

  // <Button onPress={this.addUser(Daniel, Daniel@gmail.com, default)} title="Add User" color="blue" />
  addUser = (name, email, img) => {
    this.rootRef
      .child("Users")
      .push()
      .set({
        name,
        email,
        img,
        firstName: "",
        lastName: "",
        favoritePlaces: {},
        visitHistory: {},
        friends: {}
      });
  };

  //   <Button
  //   onPress={this.addFriend(
  //     "-LCBq7GwsW6LE5SWZRo5",
  //     "-LCFVZiSV8FFN_sprt2s"
  //   )}
  //   title="Add Friend"
  //   color="blue"
  // />

  addFriend = (currentId, userId) => {
    this.rootRef
      .child("Users")
      .child(userId)
      .child("Friends")
      .push()
      .set({ [currentId]: 0 });
  };

  acceptFriend = (currentId, userId) => {
    const self = this;
    const request = this.rootRef
      .child("Users")
      .child(currentId)
      .child("Friends")
      .orderByChild(userId)
      .equalTo(0);
    request.once("value", snap => {
      snap.ref.remove();
      self.rootRef
        .child("Users")
        .child(currentId)
        .child("Friends")
        .push()
        .set({ [userId]: 1 });
    });
    this.rootRef
      .child("Users")
      .child(userId)
      .child("Friends")
      .push()
      .set({ [currentId]: 1 });
  };

  acceptFriendRequest = userId => {};

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

  // <Button
  //         onPress={this.getChatrooms("Mark")}
  //         title="get rooms"
  //         color="blue"
  //       />
  getChatrooms = username => {
    const rooms = this.rootRef
      .child("Conversations")
      .orderByChild(username)
      .equalTo(true);
    //Returns Users Rooms
    let col = [];
    //creates array of object containing room id and participants
    rooms.once("value", snap => {
      Object.keys(snap.val()).forEach(key => {
        col.push({ conversationId: key });
      });
      Object.values(snap.val()).forEach((room, i) => {
        col[i]["participants"] = Object.keys(room).join(", ");
      });
      //returns array of object containing room id and participants
      alert(JSON.stringify(col));
    });
  };

  // <Button
  //   onPress={this.sendChat(
  //     "-LCC6vGy_CZuI-WSrKzS",
  //     "Mark",
  //     "We're Almost There Guys!"
  //   )}
  //   title="Send Chat"
  //   color="blue"
  // />
  sendChat = (conversation, sender, content) => {
    this.rootRef
      .child("Messages")
      .push()
      .set({
        content: content,
        conversation: conversation,
        sender: sender,
        createdAt: Date.now()
      });
  };

  // <Button
  //   onPress={this.getChats("-LCC6vGy_CZuI-WSrKzS")}
  //   title="Get Chats"
  //   color="blue"
  // />
  getChats = conversationId => {
    let messages = this.rootRef
      .child("Messages")
      .orderByChild("conversation")
      .equalTo(conversationId);
    messages.once("value", snap => {
      alert(JSON.stringify(snap.val()));
    });
  };

  // <Button
  //   onPress={this.addFavoritePlace(
  //     "Mark",
  //     "Del Taco",
  //     5,
  //     "taco.png",
  //     23456234
  //   )}
  //   title="Add Place"
  //   color="blue"
  // />
  addFavoritePlace = (user, name, rating, image, yelpId) => {
    const place = {
      name,
      image,
      rating,
      yelpId
    };
    this.rootRef
      .child("Users")
      .child(user)
      .child("FavoritePlaces")
      .push()
      .set(place);
  };

  // <Button
  //   onPress={this.addVisit("Mark", "Del Taco", 5, "taco.png", 23456234)}
  //   title="Check In"
  //   color="blue"
  // />
  addVisit = (user, name, rating, image, yelpId) => {
    const place = {
      name,
      image,
      rating,
      yelpId
    };
    this.rootRef
      .child("Users")
      .child(user)
      .child("VisitHistory")
      .push()
      .set(place);
  };

  componentWillUnmount() {
    this.rootRef.off();
  }
  render() {
    return (
      <View>
        <Button
          onPress={this.addUser("Mark", "Mark@gmail.com", "default")}
          title="Add User"
          color="blue"
        />
      </View>
    );
  }
}
