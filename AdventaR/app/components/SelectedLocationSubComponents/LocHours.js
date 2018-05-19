import React, { Component } from 'react';
import {Text, StyleSheet, View } from 'react-native'
const moment = require('moment');

export default class LocHours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: [
        {
            open: [
                {
                    "is_overnight": Boolean, //Boolean, Whether the business opens overnight or not. When this is true, the end time will be lower than the start time.
                    "start": "", //String, Start of the opening hours in a day, in 24-hour clock notation, like 1000 means 10 AM.
                    "end": "", //String, End of the opening hours in a day, in 24-hour clock notation, like 2130 means 9:30 PM.
                    "day": 0 //Int, From 0 to 6, representing day of the week from Monday to Sunday. Notice that you may get the same day of the week more than once if the business has more than one opening time slots.
                }
            ],
            "hours_type": "", //String, The type of the opening hours information. Right now, this is always REGULAR.
            "is_open_now": Boolean //Boolean, Describe is business is open now
        }
      ]
    }
  }

  render() {
    const openStatus = this.props.hours ?
      this.props.hours[0].is_open_now ?
        <Text style={{color: '#79C727'}}> Open </Text>
        :
        <Text style={{color: '#C41200'}}> Closed </Text>
      : null

    const todayDayOfWeek = moment().diff(moment().startOf('week'), 'days')

    const todayHour = this.props.hours && this.props.hours[0].open.map( day => {
      return (
        day.day === todayDayOfWeek ?
        `${moment(day.start, 'hmm').format('hh:mm A')} - ${moment(day.end, 'hmm').format('hh:mm A')}`
        :
        null
      )
    })

    return(
      <View style={styles.container}>
        {openStatus}
        <Text>{todayHour}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 2.5
  }
})