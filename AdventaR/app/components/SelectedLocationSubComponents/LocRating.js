import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default class LocRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 4.5, //Float: A signed double-precision floating-point value.
    }
  }

  render() {
    let rating = this.state.rating;

    const currentRating = (rating === 0) ?
      <View>
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
      </View>
      :
      (rating === 1) ?
        <View>
          <Icon name='star' type='font-awesome' color='#f7bd7f' />
          <Icon name='star-o' type='font-awesome' color='#cccccc' />
          <Icon name='star-o' type='font-awesome' color='#cccccc' />
          <Icon name='star-o' type='font-awesome' color='#cccccc' />
          <Icon name='star-o' type='font-awesome' color='#cccccc' />
        </View>
        :
        <View>
        
        </View>
        


    return(
      <View style={styles.container}>

        {/* Star Rating */}
        <Icon name='star' type='font-awesome' />
        {/* half full */}
        <Icon name='star-half-full' type='font-awesome' />
        {/* empty star */}
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
        {/* one/one.five star */}
        <Icon name='star' type='font-awesome' color='#f7bd7f' />
        {/* two/two.five star */}
        <Icon name='star' type='font-awesome' color='#ffc036' />
        {/* three/three.five star */}
        <Icon name='star' type='font-awesome' color='#ff924d' />
        {/* four/four.five star */}
        <Icon name='star' type='font-awesome' color='#fa5c53' />
        {/* five star */}
        <Icon name='star' type='font-awesome' color='#dc2d20' />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})