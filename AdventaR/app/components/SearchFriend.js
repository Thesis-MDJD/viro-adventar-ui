import React, { Component } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import { View, Text, StyleSheet, Image, FlatList} from 'react-native';
import { SearchBar, ListItem, List } from 'react-native-elements'

=======
import { View, ScrollView, Input, Text } from 'react-native';
import { SearchBar, Avatar } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Input } from 'react-native-elements';
>>>>>>> in progress SearchFriend
=======
import { View, Text, StyleSheet, Image, FlatList} from 'react-native';
import { SearchBar, ListItem, List } from 'react-native-elements'

>>>>>>> implemented friends list with hard data

export default class SearchFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
<<<<<<< HEAD
      loading: false,
      searched: [
        {name: 'Lady1WOIENW', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'},
        {name: 'Lady2', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg'},
        {name: 'Lady3', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}
      ],
=======
=======
      loading: false,
>>>>>>> implemented friends list with hard data
      searched: [
        {name: 'Lady1WOIENW', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'},
        {name: 'Lady2', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg'},
        {name: 'Lady3', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}
<<<<<<< HEAD
      ]
>>>>>>> in progress SearchFriend
=======
      ],
>>>>>>> implemented friends list with hard data
    }
  }

  onTextInput(text) {
    //run the search function here
  }

<<<<<<< HEAD
<<<<<<< HEAD
  renderHeader() {
    return <SearchBar placeholder='Search for friends here...' lightTheme round />
  }

  render() {
    return(
      <List style={styles.container}>
        <FlatList
          data={this.state.searched}
          ListHeaderComponent={this.renderHeader}
          renderItem={({item}) => {
            return (
              <ListItem
              roundAvatar
              title={item.name}
              avatar={{ uri: item.img }}
              />
            )
          }}
          keyExtractor={item => item.img} // change to key later
          />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: 'grey'
  }
})
=======
=======
  renderHeader() {
    return <SearchBar placeholder='Search for friends here...' lightTheme round />
  }
>>>>>>> implemented friends list with hard data

  render() {
    return(
      <List style={styles.container}>
        <FlatList
          data={this.state.searched}
          ListHeaderComponent={this.renderHeader}
          renderItem={({item}) => {
            return (
              <ListItem
              roundAvatar
              title={item.name}
              avatar={{ uri: item.img }}
              />
            )
          }}
          keyExtractor={item => item.img} // change to key later
          />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: 'grey'
  }
<<<<<<< HEAD
}
>>>>>>> in progress SearchFriend
=======
})
>>>>>>> implemented friends list with hard data
