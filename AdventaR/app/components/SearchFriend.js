import React, { Component } from 'react';
import { View, ScrollView, Input, Text } from 'react-native';
import { SearchBar, Avatar } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Input } from 'react-native-elements';

export default class SearchFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searched: [
        {name: 'Lady1', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'},
        {name: 'Lady2', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg'},
        {name: 'Lady3', img: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}
      ]
    }
  }

  onTextInput(text) {
    //run the search function here
  }


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