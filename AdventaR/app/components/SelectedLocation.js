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
import { REST_SERVER_IP } from "react-native-dotenv";


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
    try {
      const data = await fetch(
        `http://${REST_SERVER_IP}/yelp/business/${id}`,
      );
      const result = await data.json();
      this.setState({ data: result })
    } catch (error) {
      console.log("Fetch Error = ", error);
    }
  };

   componentDidMount() {
    this.getPlace(this.state.restaurantId)
    this.props.navigation.setParams({ goBackToPrevious: this.goBackToPrevious});
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
      // go back to previous view
      headerLeft: (
        <Button onPress={params.goBackToPrevious} title="Back" color="#fff" />
      )
    };
  };

  goBackToPrevious = () => {
    this.props.navigation.goBack();
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