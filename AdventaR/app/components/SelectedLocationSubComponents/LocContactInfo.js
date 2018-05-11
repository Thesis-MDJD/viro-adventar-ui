import React, { Component } from 'react';
import { Linking, View, Button, StyleSheet, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import call from 'react-native-phone-call';
import { withNavigation } from 'react-navigation'

class LocContactInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      phone: '', //String, Phone number of the business.
      display_phone: '', //String, Phone number of the business formatted nicely to be displayed to users. The format is the standard phone number format for the business's country.
      url: "",  //String, URL for business page onYelp
    };
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onYelpPress = this.onYelpPress.bind(this);
    this.onLogOutPress = this.onLogOutPress.bind(this);
  }

  onPhonePress(){
    const args = {
      number: this.props.phone,
      prompt: false
    }
    this.props.phone === '' ? alert('No phone number available') : call(args).catch(console.error)
  }

  onYelpPress(){
    const url = this.props.url
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err))
  }

  onLogOutPress = async () => {
    await AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth')
  }

  render() {
    return(
      <View style={styles.container}>
        {/* Phone */}
        <Icon
        raised
        name='phone'
        type='font-awesome'
        color='#00d36d'
        onPress={this.onPhonePress}
        />
        {/*  Log Out */}
        <Icon
        raised
        name='log-out'
        type='feather'
        color='#00a7de'
        onPress={this.onLogOutPress}
        />
        {/* YELP redirect */}
        <Icon
        name='yelp'
        type='font-awesome'
        color='#d32323'
        onPress={this.onYelpPress}
        raised
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f68055',
    paddingVertical: 15,
    
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})

export default withNavigation(LocContactInfo)