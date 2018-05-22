import React, { Component } from "react";
import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "./FireBase";
import LocRating from "./SelectedLocationSubComponents/LocRating";
import redirectToYelp from "./util/redirectToYelp";

export default class FavoritePlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.navigation.state.params.username,
      dbId: this.props.navigation.state.params.dbId,
      places: []
    };
    this.rootRef = firebaseApp
      .database()
      .ref()
      .child("Features")
      .child("Users")
      .child(this.state.dbId)
      .child("FavoritePlaces");
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: 'My Favorite Places',
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerLeft: (
        <Icon name="arrow-left-thick" type="material-community" color="white" onPress={() => navigation.goBack()} />
      )
    };
  };

  componentDidMount() {
    const self = this;
    this.rootRef.on("value", function(snapshot) {
      const values = [];
      for (let key in snapshot.val()) {
        values.push(snapshot.val()[key]);
      }
      self.setState({
        places: values
      });
    });
  }

  componentWillUnmount() {
    this.rootRef.off();
  }
  
  render() {
    const status = this.state.places.length > 0 ?
      (<ScrollView>
        {this.state.places.map(place => {
          return (
            <View key={place.yelpId} style={styles.placeContainer}>
              <View>
                <Image style={styles.placeImage} source={{uri: place.image}} />
              </View>

              <View style={styles.nameRatingContainer}>
                <View>
                  <Text style={styles.name}> {place.name} </Text>
                </View>
                <LocRating rating={place.rating} />
              </View>

              <View style={styles.yelpIcon}>
                <Icon
                  name='yelp'
                  type='font-awesome'
                  color='#d32323'
                  onPress={() => redirectToYelp(place.url)}
                  raised
                  reverse
                />
              </View>
            </View>
          );
        })}
      </ScrollView>)
      :
      (<View style={styles.status}>
        <Text style={styles.name}>No place favorited.</Text>
      </View>);

    return (
      <View>
        {status}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  status: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeContainer: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
    paddingVertical: 6,
    paddingLeft: 6,
    borderRadius: 10
  },
  placeImage: {
    height: 75,
    width: 75,
    borderRadius: 10 
  },
  nameRatingContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 8
  },
  name: {
    fontSize: 18,
    fontWeight: "bold"
  },
  yelpIcon: {
    paddingRight: 8
  }
})
// See what my favorite places are

// - Select favorite places from users where user is username
