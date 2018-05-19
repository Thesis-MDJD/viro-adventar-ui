import React, { Component } from "react";
import { View, StyleSheet, Image, Platform } from "react-native";

export default class LocRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0, //Float: A signed double-precision floating-point value.
    };
  }

  render() {
    let rating = this.props.rating;

    const currentRatingAndroid = rating === 5 ?
      <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_5.png")} />  
      :
      rating === 4.5 ?
        <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_4_half.png")} /> 
        :
        rating === 4 ?
          <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_4.png")} />
          :
          rating === 3.5 ?
            <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_3_half.png")} />
            :
            rating === 3 ?
              <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_3.png")} />
              :
              rating === 2.5 ?
                <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_2_half.png")} />
                :
                rating === 2 ?
                  <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_2.png")} />
                  :
                  rating === 1.5 ?
                    <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_1_half.png")} />
                    :
                    rating === 1 ?
                      <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_1.png")} />
                      :  
                      <Image height={34} width={170} resizeMode='contain' source={require("../../../android/app/src/main/res/drawable-hdpi/small/stars_small_0.png")} />;

    const currentRatingIOSWEB = rating === 5 ?
      <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_5.imageset/small_5.png")} />  
      :
      rating === 4.5 ?
        <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_4_half.imageset/small_4_half.png")} /> 
        :
        rating === 4 ?
          <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_4.imageset/small_4.png")} />
          :
          rating === 3.5 ?
            <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_3_half.imageset/small_3_half.png")} />
            :
            rating === 3 ?
              <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_3.imageset/small_3.png")} />
              :
              rating === 2.5 ?
                <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_2_half.imageset/small_2_half.png")} />
                :
                rating === 2 ?
                  <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_2.imageset/small_2.png")} />
                  :
                  rating === 1.5 ?
                    <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_1_half.imageset/small_1_half.png")} />
                    :
                    rating === 1 ?
                      <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_1.imageset/small_1.png")} />
                      :  
                      <Image resizeMode='contain' style={styles.iosImage} source={require("../../../ios/YelpStars.xcassets/small/small_0.imageset/small_0.png")} />;

    let currentRating = Platform.OS === "android" ?
      currentRatingAndroid
      :
      currentRatingIOSWEB;

    return (
      <View style={styles.container}>
        {currentRating}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iosImage: {
    height: 34,
    width: 170
  }
});