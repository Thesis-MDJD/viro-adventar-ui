import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Icon } from 'react-native-elements';

export default class LocRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0, //Float: A signed double-precision floating-point value.
    }
  }

  render() {
    let rating = this.props.rating;

    const currentRatingAndroid = rating === 5 ?
      <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_5.png'}} />  
      :
      rating === 4.5 ?
        <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_4_half.png'}} /> 
        :
        rating === 4 ?
          <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_4.png'}} />
          :
          rating === 3.5 ?
            <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_3_half.png'}} />
            :
            rating === 3 ?
              <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_3.png'}} />
              :
              rating === 2.5 ?
                <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_2_half.png'}} />
                :
                rating === 2 ?
                  <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_2.png'}} />
                  :
                  rating === 1.5 ?
                      <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_1_half.png'}} />
                    :
                    rating === 1 ?
                      <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_1.png'}} />
                      :  
                      <Image height={34} width={170} resizeMode='contain' source={{uri: 'stars_large_0.png'}} />

    const currentRatingIOSWEB = rating === 5 ?
      <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_5'}} />  
      :
      rating === 4.5 ?
        <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_4_half'}} /> 
        :
        rating === 4 ?
          <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_4'}} />
          :
          rating === 3.5 ?
            <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_3_half'}} />
            :
            rating === 3 ?
              <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_3'}} />
              :
              rating === 2.5 ?
                <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_2_half'}} />
                :
                rating === 2 ?
                  <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_2'}} />
                  :
                  rating === 1.5 ?
                      <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_1_half'}} />
                    :
                    rating === 1 ?
                      <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_1'}} />
                      :  
                      <Image resizeMode='contain' style={styles.iosImage} source={{uri: 'large_0'}} />

    let currentRating = Platform.OS === 'android' ?
      currentRatingAndroid
      :
      currentRatingIOSWEB

    return(
      <View style={styles.container}>
        {currentRating}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iosImage: {
    height: 34,
     width: 170
  }
})