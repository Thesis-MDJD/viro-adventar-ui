import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage} from 'react-native';
import { Icon } from 'react-native-elements';
import { firebaseApp } from '../FireBase';
import LocRating from './LocRating';
import LocPriceRange from './LocPriceRange';
import LocHours from './LocHours';

export default class LocBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '0', //String
      review_count: 0, //integer
      categories: [],
      // non-yelp
      favorite: false,
      checkedIn: false
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features");
  }

  componentDidMount() {
    this.checkFavoriteStatus(this.props.yelpId);
    this.checkCheckedInStatus(this.props.yelpId);
  }

  onCheckedInPress = async () => {
    try {
      const userId = await AsyncStorage.getItem('dbId');
      this.state.checkedIn ?
      this.removeCheckedInPlace(this.props.yelpId)
      :
      this.addCheckedInPlace(userId, this.props.name, this.props.rating, this.props.photo, this.props.yelpId);
        
      this.props.updateCheckedIn(this.props.yelpId)
    } catch (error) {
      console.log('Error on adding/removing checkedIn', error);
    }
  }

  checkCheckedInStatus = async (yelpId) => {
    try {
      const userId = await AsyncStorage.getItem('dbId');
      let status = this.rootRef
        .child('Users')
        .child(userId)
        .child('CheckedInPlaces')
        .orderByChild('yelpId')
        .equalTo(yelpId)
      status.once('value')
        .then( snapshot => {
          snapshot.exists() && this.setState({checkedIn: true})
        })
    } catch (error) {
      console.log('Error at check', error)
    }
  }

  addCheckedInPlace = (userId, name, rating, image, yelpId) => {
    const place = {
      name,
      image,
      rating,
      yelpId
    };
    this.rootRef
      .child("Users")
      .child(userId)
      .child("CheckedInPlaces")
      .push()
      .set(place);
    this.setState({checkedIn: true})
  };

  removeCheckedInPlace = async (yelpId) => {
    try {
      const userId = await AsyncStorage.getItem('dbId');
      let checkedIned = this.rootRef
        .child('Users')
        .child(userId)
        .child('CheckedInPlaces')
        .orderByChild('yelpId')
        .equalTo(yelpId)
      checkedIned.once('value', (snapshot) => {
        let fbId = Object.keys(snapshot.val())
        this.rootRef
        .child('Users')
        .child(userId)
        .child('CheckedInPlaces')
        .child(fbId[0])
        .ref.remove()
      });
      this.setState({checkedIn: false});
    } catch (error) {
      console.log('Error', error)
    }
  }

  onFavoritePress = async () => {
    try {
      const userId = await AsyncStorage.getItem('dbId');
      this.state.favorite ?
      this.removeFavoritePlace(this.props.yelpId)
      :
      this.addFavoritePlace(userId, this.props.name, this.props.rating, this.props.photo, this.props.yelpId);
        
      this.props.updateFavorite(this.props.yelpId)
    } catch (error) {
      console.log('Error on adding/removing Favoriting', error);
    }
  }

  checkFavoriteStatus = async (yelpId) => {
    try {
      const userId = await AsyncStorage.getItem('dbId');
      let status = this.rootRef
        .child('Users')
        .child(userId)
        .child('FavoritePlaces')
        .orderByChild('yelpId')
        .equalTo(yelpId)
      status.once('value')
        .then( snapshot => {
          snapshot.exists() && this.setState({favorite: true})
        })
    } catch (error) {
      console.log('Error at check', error)
    }
  }

  addFavoritePlace = (userId, name, rating, image, yelpId) => {
    const place = {
      name,
      image,
      rating,
      yelpId
    };
    this.rootRef
      .child("Users")
      .child(userId)
      .child("FavoritePlaces")
      .push()
      .set(place);
    this.setState({favorite: true})
  };

  removeFavoritePlace = async (yelpId) => {
    try {
      const userId = await AsyncStorage.getItem('dbId');
      let favorited = this.rootRef
        .child('Users')
        .child(userId)
        .child('FavoritePlaces')
        .orderByChild('yelpId')
        .equalTo(yelpId)
      favorited.once('value', (snapshot) => {
        let fbId = Object.keys(snapshot.val())
        this.rootRef
        .child('Users')
        .child(userId)
        .child('FavoritePlaces')
        .child(fbId[0])
        .ref.remove()
      });
      this.setState({favorite: false});
    } catch (error) {
      console.log('Error', error)
    }
  }

  render() {
    const checkedInStatus = this.state.checkedIn ?
      <View>
        <Icon name='check-circle' type='material-community' color='#1aa85d' onPress={this.onCheckedInPress}/>
      </View>
      :
      <View>
        <Icon name='check-circle-outline' type='material-community' color='#769db0' onPress={this.onCheckedInPress}/>
      </View>

    const favoriteStatus = this.state.favorite ?
      <View>
        <Icon name='heart' type='material-community' color='#ff4f7d' onPress={this.onFavoritePress}/>
      </View>
      :
      <View>
        <Icon name='heart-outline' type='material-community' color='#769db0' onPress={this.onFavoritePress}/>
      </View>

    const categories = this.props.categories.map( category => category.title ).join(', ');

    return(
      <View style={styles.container}>

        <View style={styles.nameFavContainer}>
          <Text style={styles.name}> {this.props.name}</Text>        
          {checkedInStatus}
          {favoriteStatus}
        </View>

        <View style={styles.ratingReviewContainer}>
          <LocRating rating={this.props.rating}/>
          <Text> base on {this.props.review_count} Reviews </Text>
        </View>

        <View style={styles.priceContainer}>
          <LocPriceRange price={this.props.price}/>
        </View>

        <View style={styles.categoriesContainer}>
          <Text ellipsizeMode='tail' >{categories}</Text>
        </View>

        <LocHours hours={this.props.hours}/>

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
    alignItems: 'center',
    marginVertical: 2.5
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  ratingReviewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2.5
  },

  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 2.5
  },

  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 2.5
  },

  hours: {
    color: 'red'
  }
})