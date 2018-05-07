import React, { Component } from 'react';
import { 
  View,
  Text,
  ScrollView,
  Image,
  Button,
  StyleSheet
 } from 'react-native';
import SelectedLocPics from './SelectedLocPics';
import SelectedLocBasicInfo from './SelectedLocBasicInfo';


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
        <Button onPress={params.goToCamera} title="Camera" color="#fff" />
      )
    };
  };

  goToCamera = () => {
    this.props.navigation.navigate("Camera");
  };

  render() {
    return(
      <ScrollView>
        <View>
          <SelectedLocPics />
        </View>

        {/* <View>
          <SelectedLocBasicInfo />
        </View> */}
      </ScrollView>
    )
  };

  
}

// const styles = StyleSheet.create({

// })