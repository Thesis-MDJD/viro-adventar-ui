import React, { Component } from "react";
import { View, StyleSheet, FlatList, Button } from "react-native";
import { SearchBar, ListItem, List } from "react-native-elements";
import { firebaseApp } from "./FireBase";

export default class SearchFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      term: "",
      searched: []
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
  }

  searchUser = () => {
    const self = this;
    const username = this.state.term.toLowerCase();
    const result = this.rootRef
      .child("Users")
      .orderByChild("username")
      .startAt(username)
      .endAt(`${username}\uf8ff`);
    let col = [];
    result.once("value", snap => {
      if (snap.val()) {
        Object.keys(snap.val()).forEach(key => {
          col.push({ userId: key });
        });
        Object.values(snap.val()).forEach((user, i) => {
          Object.entries(user).forEach(prop => {
            col[i][prop[0]] = prop[1];
          });
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
      }
      self.setState({
        searched: col
      });
    });
  };

  goToOtherProfile = id => {
    this.props.navigation.navigate("otherProfile", { userId: id });
  };

  goBackToPrevious = () => {
    this.props.navigation.goBack();
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
      )
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search for friends here..."
          lightTheme
          round
          onClear={this.clearSelected}
          onChangeText={text => this.setState({ term: text })}
          onSubmitEditing={this.searchUser}
          returnKeyType="search"
        />
        <List>
          <FlatList
            data={this.state.searched}
            ListHeaderComponent={this.renderHeader}
            renderItem={({ item }) => {
              return (
                <ListItem
                  key={item.userId}
                  roundAvatar
                  title={item.username}
                  avatar={{ uri: item.image }}
                  onPress={() => {
                    this.goToOtherProfile(item.userId);
                  }}
                />
              );
            }}
            keyExtractor={item => item.image} // change to key later
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
