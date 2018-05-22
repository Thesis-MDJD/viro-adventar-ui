import React, { Component } from "react";
import { Linking, View, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import call from "react-native-phone-call";
import { withNavigation } from "react-navigation";
import redirectToYelp from "../util/redirectToYelp";

class LocContactInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      phone: "", //String, Phone number of the business.
      displayPhone: "", //String, Phone number of the business formatted nicely to be displayed to users. The format is the standard phone number format for the business's country.
      url: "", //String, URL for business page onYelp
    };
    this.onPhonePress = this.onPhonePress.bind(this);
  }

  onPhonePress() {
    const args = {
      number: this.props.phone,
      prompt: false
    };
    this.props.phone === "" ? alert("No phone number available") : call(args).catch(console.error);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* Phone */}
        <Icon
          raised
          name='phone'
          type='font-awesome'
          size={36}
          color='#00d36d'
          onPress={this.onPhonePress}
        />

        {/* YELP redirect */}
        <Icon
          name='yelp'
          type='font-awesome'
          size={36}
          color='#d32323'
          onPress={() => redirectToYelp(this.props.url)}
          raised
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f68055",
    paddingVertical: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});

export default withNavigation(LocContactInfo);