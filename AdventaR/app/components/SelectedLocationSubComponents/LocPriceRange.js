import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default class LocPriceRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: "", 
      // Price level of the business. Value is one of $, $$, $$$ and $$$$ or null if we don't have price available for the business.
    }
  }

  render() {
    const priceRange = this.props.price === '$$$$' ?
      <View style={styles.container}>
        <Icon name='dollar' type='font-awesome' size={20}/>
        <Icon name='dollar' type='font-awesome' size={20}/>
        <Icon name='dollar' type='font-awesome' size={20}/>
        <Icon name='dollar' type='font-awesome' size={20}/>
      </View>
      :
      this.props.price === '$$$' ?
        <View style={styles.container}>
          <Icon name='dollar' type='font-awesome' size={20}/>
          <Icon name='dollar' type='font-awesome' size={20}/>
          <Icon name='dollar' type='font-awesome' size={20}/>
          <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
        </View>
        :
        this.props.price === '$$' ?
          <View style={styles.container}>
            <Icon name='dollar' type='font-awesome' size={20}/>
            <Icon name='dollar' type='font-awesome' size={20}/>
            <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
            <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
          </View>
          : this.props.price === '$' ?
            <View style={styles.container}>
              <Icon name='dollar' type='font-awesome' size={20}/>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
            </View>
            :
            <View style={styles.container}>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
              <Icon name='dollar' type='font-awesome' color='#999999' size={20}/>
            </View>
            
    return(
      priceRange
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})