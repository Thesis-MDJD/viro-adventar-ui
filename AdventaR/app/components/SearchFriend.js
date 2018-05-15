import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { SearchBar, ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";

export default class SearchFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      term: "",
      searched: [
        {
          name: "Lady1WOIENW",
          img: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
        },
        {
          name: "Lady2",
          img:
            "https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg"
        },
        {
          name: "Lady3",
          img: "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
        }
      ]
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }

  searchUser = () => {
    const username = this.state.term.toLowerCase();
    const result = this.rootRef
      .child("Users")
      .orderByChild("username")
      .startAt(username);
    let col = [];
    //creates array of object containing room id and participants
    result.once("value", snap => {
      Object.keys(snap.val()).forEach(key => {
        col.push({ userId: key });
      });
      Object.values(snap.val()).forEach((user, i) => {
        let values = Object.values(user);
        let keys = Object.keys(user);
        col[i][keys[0]] = values[0];
        col[i][keys[1]] = values[1];
      });
      col.sort(function(a, b) {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
      });
      this.setState({
        searched: col
      });
    });
  };

  goToOtherProfile = id => {
    this.props.navigation.navigate("otherProfile", { userId: id });
  };

  render() {
    return (
      <View>
        <SearchBar
          placeholder="Search for friends here..."
          lightTheme
          round
          onClear={this.clearSelected}
          onChangeText={text => this.setState({ term: text })}
          onSubmitEditing={this.searchUser}
          returnKeyType="search"
        />
        <List style={styles.container}>
          <FlatList
            data={this.state.searched}
            ListHeaderComponent={this.renderHeader}
            renderItem={({ item }) => {
              return (
                <ListItem
                  key={item.userId}
                  roundAvatar
                  title={item.username}
                  avatar={{ uri: item.img }}
                  onPress={() => {
                    this.goToOtherProfile(item.userId);
                  }}
                />
              );
            }}
            keyExtractor={item => item.img} // change to key later
          />
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flatListFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "grey"
  }
});
