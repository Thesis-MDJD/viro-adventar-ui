import React, { Component } from 'react';
import { StyleSheet, View, Text,} from 'react-native';

export default class SelectedLocBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Text 
          style={styles.name} 
          // numberOfLines= {1}
          // ellipsizeMode='tail'
        >
          Restaurant name goes here
        </Text>

        {/* Star Rating */}
        <Text >
          'review count' Reviews
        </Text>

        {/* Price/Money sign goes here */}
        <Text>
          Category(s)
        </Text>

        <Text style={styles.hours}>
          open /close status / hours
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1
  },

  name: {
    fontWeight: 'bold'
  },

  hours: {
    color: 'red'
  }
})