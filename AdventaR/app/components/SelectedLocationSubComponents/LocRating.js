import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default class LocRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 1.5, //Float: A signed double-precision floating-point value.
    }
  }

  render() {
    let rating = this.state.rating;

    const currentRating = rating === 5 ?
      <View style={styles.container}>
        <Icon name='star' type='font-awesome' color='#dc2d20' />
        <Icon name='star' type='font-awesome' color='#dc2d20' />
        <Icon name='star' type='font-awesome' color='#dc2d20' />
        <Icon name='star' type='font-awesome' color='#dc2d20' />
        <Icon name='star' type='font-awesome' color='#dc2d20' />
      </View>  
      :
      rating === 4.5 ?
        <View style={styles.container}>
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star-half-full' type='font-awesome' color='#fa5c53' />
        </View>
        :
        rating === 4 ?
        <View style={styles.container}>
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star' type='font-awesome' color='#fa5c53' />
          <Icon name='star-o' type='font-awesome' color='#cccccc' />
        </View>
        :
        rating === 3.5 ?
          <View style={styles.container}>
            <Icon name='star' type='font-awesome' color='#ff924d' />
            <Icon name='star' type='font-awesome' color='#ff924d' />
            <Icon name='star' type='font-awesome' color='#ff924d' />
            <Icon name='star-half-full' type='font-awesome' color='#ff924d'/>
            <Icon name='star-o' type='font-awesome' color='#cccccc' />
          </View>
          :
          rating === 3 ?
            <View style={styles.container}>
              <Icon name='star' type='font-awesome' color='#ff924d' />
              <Icon name='star' type='font-awesome' color='#ff924d' />
              <Icon name='star' type='font-awesome' color='#ff924d' />
              <Icon name='star-o' type='font-awesome' color='#cccccc' /> 
              <Icon name='star-o' type='font-awesome' color='#cccccc' /> 
            </View>
            :
            rating === 2.5 ?
              <View>
                <Icon name='star' type='font-awesome' color='#ffc036' />
                <Icon name='star' type='font-awesome' color='#ffc036' />
                <Icon name='star-half-full' type='font-awesome' color='#ffc036'/>
                <Icon name='star-o' type='font-awesome' color='#cccccc' />
                <Icon name='star-o' type='font-awesome' color='#cccccc' />
              </View>
              :
              rating === 2 ?
                <View style={styles.container}>
                  <Icon name='star' type='font-awesome' color='#ffc036' />
                  <Icon name='star' type='font-awesome' color='#ffc036' />
                  <Icon name='star-o' type='font-awesome' color='#cccccc' />
                  <Icon name='star-o' type='font-awesome' color='#cccccc' />
                  <Icon name='star-o' type='font-awesome' color='#cccccc' />
                </View>
                :
                rating === 1.5 ?
                  <View style={styles.container}>
                    <Icon name='star' type='font-awesome' color='#f7bd7f' /> 
                    <Icon name='star-half-full' type='font-awesome' color='#f7bd7f'/>
                    <Icon name='star-o' type='font-awesome' color='#cccccc' />
                    <Icon name='star-o' type='font-awesome' color='#cccccc' />
                    <Icon name='star-o' type='font-awesome' color='#cccccc' />
                  </View>
                  :
                  rating === 1 ?
                    <View style={styles.container}>
                      <Icon name='star' type='font-awesome' color='#f7bd7f' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                    </View>
                    :  
                    <View style={styles.container}>
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                      <Icon name='star-o' type='font-awesome' color='#cccccc' />
                    </View>

    return(
      currentRating
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})