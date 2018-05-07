import React, { Component } from 'react';
import { StyleSheet, View, Text,} from 'react-native';

export default class SelectedLocBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Restaurant Name', //String
      review_count: 0, //integer
      rating: 4.5, //Float: A signed double-precision floating-point value.
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
          {this.state.name} goes here &#x1F5A4;
        </Text>

        {/* Star Rating */}
        <Text >
        &#9733;&#9733;&#9733;&#9734;&#9734;{this.state.review_count} &#f089; Reviews
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