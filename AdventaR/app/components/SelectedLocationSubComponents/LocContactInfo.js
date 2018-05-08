import React, { Component } from 'react';
import { Linking, View, Button, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import call from 'react-native-phone-call'

export default class LocContactInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //String, Phone number of the business.
      phone: '+16262812266', 
      //String, Phone number of the business formatted nicely to be displayed to users. The format is the standard phone number format for the business's country.
      display_phone: '(626) 281-2266', 
      //String, URL for business page onYelp
      url: "https://www.yelp.com/biz/bon-appetea-cafe-alhambra?adjust_creative=gQRrphyAAi4hAIl9WD_6MA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=gQRrphyAAi4hAIl9WD_6MA", 
    };
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onYelpPress = this.onYelpPress.bind(this);
  }

  onPhonePress(){
    const args = {
      number: this.state.phone,
      prompt: false
    }
    call(args).catch(console.error)
  }

  onYelpPress(){
    const url = this.state.url
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err))
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
        {/*  URL */}
        <Icon
        raised
        name='external-link'
        type='font-awesome'
        color='#00a7de'
        onPress={() => alert('LINK')}
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