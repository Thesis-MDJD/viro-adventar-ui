import React, { Component } from 'react';
import { StyleSheet, View, Text,} from 'react-native';
import { Icon } from 'react-native-elements';

export default class SelectedLocBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Restaurant Name', //String
      review_count: 0, //integer
      rating: 4.5, //Float: A signed double-precision floating-point value.
      price: '1', //String: Optional. Pricing levels to filter the search result with: 1 = $, 2 = $$, 3 = $$$, 4 = $$$$. The price filter can be a list of comma delimited pricing levels. For example, "1, 2, 3" will filter the results to show the ones that are $, $$, or $$$.
      categories: {
        title: '', // String, Title of a category for display purpose.
        alias: '' // String, Alias of a category, when searching for business in certain categories, use alias rather than the title.
      },
      hours: {
        hours_type: 'REGULAR', //String, The type of the opening hours information. Right now, this is always REGULAR.
        is_open_now: true, //Boolean, Describe is business is open now
        open: {
          is_overnight: true, //Boolean, Whether the business opens overnight or not. When this is true, the end time will be lower than the start time.
          end: '', //String, End of the opening hours in a day, in 24-hour clock notation, like 2130 means 9:30 PM.
          start: '', //String, Start of the opening hours in a day, in 24-hour clock notation, like 1000 means 10 AM.
          day: 0 //Int, From 0 to 6, representing day of the week from Monday to Sunday. Notice that you may get the same day of the week more than once if the business has more than one opening time slots.
        }
      }
    }
  }

  render() {
    /* Conditional Rendering for:
      open status
      rating => stars
      price => dollor signs
    */


    return(
      <View style={styles.container}>
        <Text 
          style={styles.name} 
          // numberOfLines= {1}
          // ellipsizeMode='tail'
        >
          {this.state.name} goes here
        </Text>
        {/* Favorited Heart */}
        <Icon name='heart' type='material-community' color='#ff4f7d' />
        {/* Unfavorited Heart */}
        <Icon name='heart-outline' type='material-community' color='#769db0' />

        {/* Star Rating */}
        <Icon name='star' type='font-awesome' />
        {/* half full */}
        <Icon name='star-half-full' type='font-awesome' />
        {/* empty star */}
        <Icon name='star-o' type='font-awesome' color='#cccccc' />
        {/* one/one.five star */}
        <Icon name='star' type='font-awesome' color='#f7bd7f' />
        {/* two/two.five star */}
        <Icon name='star' type='font-awesome' color='#ffc036' />
        {/* three/three.five star */}
        <Icon name='star' type='font-awesome' color='#ff924d' />
        {/* four/four.five star */}
        <Icon name='star' type='font-awesome' color='#fa5c53' />
        {/* five star */}
        <Icon name='star' type='font-awesome' color='#dc2d20' />

        <Text >
        {this.state.review_count} Reviews
        </Text>
        

        {/* Selected Price Range*/}
        <Icon name='dollar' type='font-awesome' />
          {/* Unelected Price Range*/}
        <Icon name='dollar' type='font-awesome' color='#999999' />

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
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
  },

  name: {
    fontWeight: 'bold'
  },

  hours: {
    color: 'red'
  }
})