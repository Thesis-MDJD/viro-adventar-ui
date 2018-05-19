import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  ActivityIndicator
} from "react-native";
import { SearchBar, ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";
export default class NewConvo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: [],
      friends: [],
      searchedFriends: [],
      loggedInUser: this.props.navigation.state.params.loggedInUser,
      text: "",
      loaded: true
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }
  componentDidMount() {
    const self = this;
    this.props.navigation.setParams({
      goBackToPrevious: this.goBackToPrevious,
      initiateChat: this.initiateChat
    });
    this.rootRef
      .child("Users")
      .child(this.state.loggedInUser.curUid)
      .child("Friends")
      .on("child_added", snap => {
        let friends = self.state.friends;
        snap.val().status === 1 ? friends.push(snap.val()) : null;
        self.setState({
          friends: friends,
          loaded: false
        });
      });
  }
  filterFriends = text => {
    text = text.toLowerCase();
    if (!text.length) {
      this.setState({
        searchedFriends: [],
        text
      });
    } else {
      let friendsFilter = this.state.friends.slice();
      friendsFilter = friendsFilter.filter(friend => {
        return friend.username.includes(text);
      });
      this.setState({
        searchedFriends: friendsFilter,
        text
      });
    }
  };
  goBackToPrevious = () => {
    this.props.navigation.goBack();
  };
  addToSelected = user => {
    let added = this.state.chosen;
    added.push(user);
    this.setState({
      chosen: added
    });
  };

  removeUser = user => {
    let chosen = this.state.chosen;
    let index = chosen.indexOf(user);
    chosen.splice(index, 1);
    this.setState({
      chosen
    });
  };

  initiateChat = () => {
    const self = this;
    const roomInfo = {
      [this.state.loggedInUser.curUid]: true
    };
    const name = [this.state.loggedInUser.username];
    this.state.chosen.forEach(person => {
      roomInfo[person.uid] = true;
      name.push(person.username);
    });
    roomInfo.people = name.join(", ");
    const convo = this.rootRef.child("Conversations").push();
    convo.set(roomInfo);
    this.props.navigation.navigate("chat", {
      convId: convo.key,
      loggedInUser: this.state.loggedInUser,
      people: roomInfo.people
    });
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: "",
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerLeft: (
        <Button onPress={params.goBackToPrevious} title="Back" color="#fff" />
      ),
      headerRight: (
        <Button onPress={params.initiateChat} title="Chat!" color="#fff" />
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
            {this.state.friends.length > 0 ? (
              <View>
                <SearchBar
                  placeholder="Search for friends here..."
                  lightTheme
                  round
                  onClear={this.clearSelected}
                  onChangeText={text => this.filterFriends(text)}
                  returnKeyType="search"
                />
                <Text>Chosen</Text>
                {this.state.chosen.length ? (
                  <List>
                    <ScrollView>
                      {this.state.chosen.map(item => {
                        return (
                          <ListItem
                            key={item.userId}
                            roundAvatar
                            title={item.username}
                            avatar={{ uri: item.img }}
                            onPress={() => {
                              this.removeUser(item);
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  </List>
                ) : null}
                <Text>Friends</Text>
                {this.state.text.length ? (
                  <List>
                    <ScrollView>
                      {this.state.searchedFriends.map(item => {
                        return (
                          <ListItem
                            key={item.userId}
                            roundAvatar
                            title={item.username}
                            avatar={{ uri: item.img }}
                            onPress={() => {
                              this.addToSelected(item);
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  </List>
                ) : (
                  <List>
                    <ScrollView>
                      {this.state.friends.map(item => {
                        return (
                          <ListItem
                            key={item.userId}
                            roundAvatar
                            title={item.username}
                            avatar={{ uri: item.img }}
                            onPress={() => {
                              this.addToSelected(item);
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  </List>
                )}
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
