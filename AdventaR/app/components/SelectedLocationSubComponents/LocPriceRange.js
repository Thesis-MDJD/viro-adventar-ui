import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

export default class LocPriceRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: '1', //String: Optional. Pricing levels to filter the search result with: 1 = $, 2 = $$, 3 = $$$, 4 = $$$$. The price filter can be a list of comma delimited pricing levels. For example, "1, 2, 3" will filter the results to show the ones that are $, $$, or $$$.
      // Price level of the business. Value is one of $, $$, $$$ and $$$$ or null if we don't have price available for the business.
    }
  }

  render() {
    return(
      <View>
        {/* Selected Price Range*/}
        <Icon name='dollar' type='font-awesome' />
          {/* UnSelected Price Range*/}
        <Icon name='dollar' type='font-awesome' color='#999999' />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
})