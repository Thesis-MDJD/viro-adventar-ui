import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

export default class LocPics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [
        "https://s3-media3.fl.yelpcdn.com/bphoto/l5Z6G6aSVfvg84efUJgSEA/o.jpg",
        "https://s3-media3.fl.yelpcdn.com/bphoto/9xFdjd1-Opeh5qZscnCR5A/o.jpg",
        "https://s3-media2.fl.yelpcdn.com/bphoto/qn024AkkXKZVniLOPfRjyw/o.jpg"
    ], //Array of String, URLs of up to three photos of the business
    }
  };

  render() {
    const photos = this.state.photos.map((photo, i) => {
      return <Image key={i} style={styles.photo} source={{uri: photo}} />
    })
    return(
      <ScrollView
      horizontal={true}
      pagingEnabled={true}
      // scrollIndicatorInsets={{top: 10, left: 10, bottom: 10, right: 10}} //ios
      >
      {/* map them out eventually */}
      {photos} 
        

      </ScrollView>
    )
  }
}

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  photo: {
    flex: 1,
    width: screenWidth,
    height: screenHeight / 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
})