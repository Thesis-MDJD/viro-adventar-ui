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


 export default class CurrLocation extends Component {
   constructor(props) {
     super(props);
     this.state = {
       name: '',

     }

   };

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
    this.props.navigation.navigate("Restaurants");
  };

  render() {
    return(
      <ScrollView>
        <StatusBar barStyle='light-content' />
          <View>
            <LocPics />
          </View>

          <View>
            <LocBasicInfo />
          </View>

          <View>
            <LocContactInfo />
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