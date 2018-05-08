import React, { Component } from 'react';
import { StyleSheet, View, Text,} from 'react-native';
import { Icon } from 'react-native-elements';

import LocRating from './LocRating';
import LocPriceRange from './LocPriceRange';
import LocHours from './LocHours';

export default class LocBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Bon Appetea Cafe', //String
      review_count: 835, //integer
      categories: [
        {
            "alias": "tea",
            "title": "Tea Rooms" //for display purpose
        },
        {
            "alias": "cafes",
            "title": "Cafes"
        },
        {
            "alias": "taiwanese",
            "title": "Taiwanese"
        }
      ],
      // non-yelp
      favorite: false 
    }
    this.onFavoritePress = this.onFavoritePress.bind(this)
  }

  onFavoritePress(){
    this.setState({favorite: !this.state.favorite})
    // send info to user data base
  }

  render() {
    const favoriteStatus = this.state.favorite ?
    //Favorited Heart
      <View>
        <Icon name='heart' type='material-community' color='#ff4f7d' onPress={this.onFavoritePress}/>
      </View>
      :
    // Unfavorited Heart
      <View>
        <Icon name='heart-outline' type='material-community' color='#769db0' onPress={this.onFavoritePress}/>
      </View>

    const categories = this.state.categories.map( category => category.title ).join(', ');

    return(
      <View style={styles.container}>

        <View style={styles.nameFavContainer}>
          <Text style={styles.name} /* numberOfLines= {1} ellipsizeMode='tail'*/> {this.state.name}</Text>
          {favoriteStatus}
        </View>

        <View style={styles.ratingReviewContainer}>
          <LocRating />
          <Text > {this.state.review_count} Reviews </Text>
        </View>

        <View style={styles.priceCategoryContainer}>
          <LocPriceRange />
          <Icon name='dot-single' type='entypo' color='#999999' />
          <Text>{categories}</Text>
        </View>

        <LocHours />
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
    marginVertical: 5
  },

  nameFavContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  name: {
    fontWeight: 'bold'
  },

  ratingReviewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  priceCategoryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  hoursContainer: {
  },

  hours: {
    color: 'red'
  }
})