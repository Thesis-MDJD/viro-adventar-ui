import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image} from 'react-native';

export default class SelectedLocPics extends Component {
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
      >
        <Image source={require('../../../AdventaR/AppIcon.png')}/>
        <Image source={require('../../../AdventaR/AppIcon.png')}/>
        <Image source={require('../../../AdventaR/AppIcon.png')}/>

      </ScrollView>
    )
  }
}

// const styles = StyleSheet.create({
  
// })