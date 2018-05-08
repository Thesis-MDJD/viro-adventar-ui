import React, { Component } from 'react';
import { StyleSheet, View, Text,} from 'react-native';


import { Icon } from 'react-native-elements';

import LocRating from './LocRating';
import LocPriceRange from './LocPriceRange';

export default class LocBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Bon Appetea Cafe', //String
      review_count: 835, //integer
      categories: {
        title: '', // String, Title of a category for display purpose.
        alias: '' // String, Alias of a category, when searching for business in certain categories, use alias rather than the title.
      },
      hours: {
        hours_type: 'REGULAR', //String, The type of the opening hours information. Right now, this is always REGULAR.
        is_open_now: true, //Boolean, Describe is business is open now
        open: {
          is_overnight: true, //Boolean, Whether the business opens overnight or not. When this is true, the end time will be lower than the start time.
          end: '', //String, End of the opening hours in a day, in 24-hour clock notation, like 2130 means 9:30 PM.
          start: '', //String, Start of the opening hours in a day, in 24-hour clock notation, like 1000 means 10 AM.
          day: 0 //Int, From 0 to 6, representing day of the week from Monday to Sunday. Notice that you may get the same day of the week more than once if the business has more than one opening time slots.
        }
      },
      // non-yelp
      favorite: false 
    }
    this.onFavoritePress = this.onFavoritePress.bind(this)
  }

  onFavoritePress(){
    this.setState({favorite: !this.state.favorite})
  }

  render() {
    /* Conditional Rendering for:
      open status
      rating => stars
      price => dollor signs
    */
    let favoriteStatus = this.state.favorite ?
      <View>
        {/* Favorited Heart */}
        <Icon name='heart' type='material-community' color='#ff4f7d' onPress={this.onFavoritePress}/>
      </View>
      :
      <View>
        {/* Unfavorited Heart */}
        <Icon name='heart-outline' type='material-community' color='#769db0' onPress={this.onFavoritePress}/>
      </View>

    return(
      <View style={styles.container}>
        <View style={styles.nameFavContainer}>
          <Text style={styles.name} /* numberOfLines= {1} ellipsizeMode='tail'*/> {this.state.name}</Text>
          {favoriteStatus}
        </View>

        {/* Star Rating */}
        <View style={styles.ratingReviewContainer}>
          <LocRating />
          <Text > {this.state.review_count} Reviews </Text>
        </View>

        <View style={styles.priceCategoryContainer}>
          <LocPriceRange />

          <Text>
            Category(s)
          </Text>
        </View>

        <View style={styles.hoursContainer}>
          <Text style={styles.hours}>
            open /close status / hours
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
  },

  nameFavContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  name: {
    fontWeight: 'bold'
  },

  ratingReviewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },

  priceCategoryContainer: {
    flex: 1,
  },

  hoursContainer: {
  },

  hours: {
    color: 'red'
  }
})