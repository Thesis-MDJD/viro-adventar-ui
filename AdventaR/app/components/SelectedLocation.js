import React, { Component } from 'react';
import { 
  View,
  Text,
  ScrollView,
  Image,
  Button,
  StyleSheet,
  StatusBar
 } from 'react-native';
import LocPics from './SelectedLocationSubComponents/LocPics';
import LocBasicInfo from './SelectedLocationSubComponents/LocBasicInfo';
import LocContactInfo from './SelectedLocationSubComponents/LocContactInfo';
import { YELP_API_KEY } from "react-native-dotenv";


 export default class SelectedLocation extends Component {
   constructor(props) {
     super(props);
     this.state = {
       name: '',
       data: {},
       restaurantId: this.props.navigation.state.params.restaurantId
     }
   };


   getPlace = async (id) => {
    let myHeaders = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + YELP_API_KEY,
    });
    try {
      const data = await fetch(
        `https://api.yelp.com/v3/businesses/${id}`,
        { headers: myHeaders }
      );
      const result = await data.json();
      this.setState({ data: result })
    } catch (error) {
      console.log("Fetch Error = ", error);
    }
  };

   componentDidMount() {
    this.getPlace(this.state.restaurantId)
    this.props.navigation.setParams({ goToRestaurants: this.goToRestaurants });
   }

   static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      // selected location's name
      title: 'Selected Location',
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      },
      // go back to camera view
      headerLeft: (
        <Button onPress={params.goToRestaurants} title="Restaurants" color="#fff" />
      )
    };
  };

  goToRestaurants = () => {
    this.props.navigation.navigate("YelpRestaurants");
  };

  render() {
    const info = this.state.data;

    return(
      <ScrollView>
        <StatusBar barStyle='light-content' />
          <View>
            {info.name ? <LocPics photos={info.photos}/> : null}
          </View>

          <View>
            {info.name ? 
            <LocBasicInfo 
              name={info.name} 
              review_count={info.review_count} 
              categories={info.categories} 
              favorite={info.favorite}
              rating={info.rating}
              price={info.price}
              hours={info.hours}
              />: null}          
          </View>

          <View>
            {info.name ? <LocContactInfo phone={info.phone} display_phone={info.display_phone} url={info.url}/> : null }
          </View>
      </ScrollView>
    )
  };

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})