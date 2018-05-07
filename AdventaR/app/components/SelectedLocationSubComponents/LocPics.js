import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

export default class LocPics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: '', //String, URLs of up to three photos of the business
    }
  };

  render() {
    return(
      <ScrollView
      horizontal={true}
      pagingEnabled={true}
      // scrollIndicatorInsets={{top: 10, left: 10, bottom: 10, right: 10}} //ios
      >
      {/* map them out eventually */}
        <Image style={styles.photo} source={require('../../../AdventaR/AppIcon.png')} />
        <Image style={styles.photo} source={require('../../../AdventaR/AppIcon.png')} />
        <Image style={styles.photo} source={require('../../../AdventaR/AppIcon.png')} />
      </ScrollView>
    )
  }
}

let screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center'
  }
})