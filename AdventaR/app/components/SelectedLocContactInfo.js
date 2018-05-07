import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default class SelectedLocContactInfo extends Component {
  constructor(props) {
    super(props);
    this.props = {
      phone: '', //String, Phone number of the business.
      display_phone: '', //String, Phone number of the business formatted nicely to be displayed to users. The format is the standard phone number format for the business's country.
      url: '', //String, URL for business page onYelp

    }
  }

  render() {
    return(
      <View style={styles.container}>
        {/* Phone */}
        <Icon
        name='phone'
        type='font-awesome'
        color='#00d36d'
        />
        {/*  URL */}
        <Icon
        name='external-link'
        type='font-awesome'
        color='#00a7de'
        />
        {/* YELP redirect */}
        <Icon
        name='yelp'
        type='font-awesome'
        color='#d32323'
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