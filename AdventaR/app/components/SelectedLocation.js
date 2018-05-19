import React, { Component } from "react";
import { 
  View,
  Text,
  ScrollView,
  Image,
  Button,
  StyleSheet,
  StatusBar
} from "react-native";
import LocPics from "./SelectedLocationSubComponents/LocPics";
import LocBasicInfo from "./SelectedLocationSubComponents/LocBasicInfo";
import LocContactInfo from "./SelectedLocationSubComponents/LocContactInfo";
import { REST_SERVER_IP } from "react-native-dotenv";


export default class SelectedLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      data: {},
      restaurantId: this.props.navigation.state.params.restaurantId,
      distance: this.props.navigation.state.params.distance,
      updateFavoritedLocations: this.props.navigation.state.params.updateFavoritedLocations,
      updateCheckedInLocations: this.props.navigation.state.params.updateCheckedInLocations,
      tabbed: this.props.navigation.state.params.tabbed
    };
  }


   getPlace = async (id) => {
     try {
       const data = await fetch(
         `http://${REST_SERVER_IP}/yelp/business/${id}`,
       );
       const result = await data.json();
       this.setState({ data: result });
     } catch (error) {
       console.log("Fetch Error = ", error);
     }
   };

   componentDidMount() {
     this.getPlace(this.state.restaurantId);
   }

   static navigationOptions = ({ navigation }) => {
     const params = navigation.state.params || {};
     return {
       title: params.name,
       headerStyle: {
         backgroundColor: "#f4511e"
       },
       headerTintColor: "#fff",
       headerTitleStyle: {
         fontWeight: "bold"
       },
       headerLeft: (
         <Button onPress={() => navigation.goBack()} title="Back" color="white" backgroundColor="f4511e"/>
       )
     };
   };

   render() {
     const info = this.state.data;
     const distance = this.state.distance === null ?
       null
       : (this.state.distance < 321.869) ?
         <Text style={styles.distanceText} color="#888882">{Math.floor(this.state.distance * 3.2808399)} ft away</Text>
         :
         <Text style={styles.distanceText} color="#888882">{Math.floor(this.state.distance * 0.000621371 * 10) / 10} mi away</Text>;

     const address = info.location && info.location.display_address.join(" ");
    
     return (
       <ScrollView contentContainerStyle={{
         flexGrow: 1,
         justifyContent: "space-between"
       }}>
         <StatusBar barStyle="light-content" />
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
               yelpId={info.id}
               photo={info.photos[0]}
               updateFavorite={this.state.updateFavoritedLocations}
               updateCheckedIn={this.state.updateCheckedInLocations}
             /> : null}          
         </View>

         <View style={styles.addressContainer}>
           <View style={styles.address}>
             <Text style={styles.addressText}>{address}</Text>
           </View>

           <View style={styles.distance}>
             {distance}
           </View>
         </View>

         <View>
           {info.name ? <LocContactInfo phone={info.phone} display_phone={info.display_phone} url={info.url}/> : null }
         </View>
       </ScrollView>
     );
   }

}

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: "#fff"
  },
  address: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    marginBottom: 2.5
  },
  addressText: {
    fontSize: 14,
    fontWeight: "bold"
  },
  distance: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5
  },
  distanceText: {
    fontSize: 12
  }
});