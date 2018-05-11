import React, { Component } from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, Image, FlatList} from 'react-native';
import { SearchBar, ListItem, List } from 'react-native-elements'

=======
import { View, ScrollView, Input, Text } from 'react-native';
import { SearchBar, Avatar } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Input } from 'react-native-elements';
>>>>>>> in progress SearchFriend

export default class SearchFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
      loading: false,
      searched: [
        {name: 'Lady1WOIENW', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'},
        {name: 'Lady2', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg'},
        {name: 'Lady3', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}
      ],
=======
      searched: [
        {name: 'Lady1', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'},
        {name: 'Lady2', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg'},
        {name: 'Lady3', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}
      ]
>>>>>>> in progress SearchFriend
    }
  }

  onTextInput(text) {
    //run the search function here
  }

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

  render() {
    const searchedFriends =
      this.state.searched.map( user => {
        return 
          <View key={user.name}>
            <Avatar
              size='medium'
              rounded
              source={{uri: user.img}}
              activeOpacity={0.7}
            />
            <Text>{user.name}</Text>
          </View>
      })

    return(
      <View>
        {/* <SearchBar
          lightTheme
          autoCorrect='none'
          // autoCapitalize={false} // is our username always Capitalized?
          placeholder='Search for chat here'
          onChangeText={(text) => this.onTextInput(text)}
        /> */}
        <View key={this.state.searched[0].name}>
            <Avatar
              size='medium'
              rounded
              source={{uri: this.state.searched[0].img}}
              activeOpacity={0.7}
            />
            <Text>{this.state.searched[0].name}</Text>
        </View>
        {searchedFriends}
      </View>
    )
  }
}
>>>>>>> in progress SearchFriend
