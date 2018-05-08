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
                    "is_overnight": false, //Boolean, Whether the business opens overnight or not. When this is true, the end time will be lower than the start time.
                    "start": "1100", //String, Start of the opening hours in a day, in 24-hour clock notation, like 1000 means 10 AM.
                    "end": "2300", //String, End of the opening hours in a day, in 24-hour clock notation, like 2130 means 9:30 PM.
                    "day": 0 //Int, From 0 to 6, representing day of the week from Monday to Sunday. Notice that you may get the same day of the week more than once if the business has more than one opening time slots.
                },
                {
                    "is_overnight": false,
                    "start": "1100",
                    "end": "2300",
                    "day": 1
                },
                {
                    "is_overnight": false,
                    "start": "1100",
                    "end": "2300",
                    "day": 2
                },
                {
                    "is_overnight": false,
                    "start": "1100",
                    "end": "2300",
                    "day": 3
                },
                {
                    "is_overnight": false,
                    "start": "1100",
                    "end": "0000",
                    "day": 4
                },
                {
                    "is_overnight": false,
                    "start": "1100",
                    "end": "0000",
                    "day": 5
                },
                {
                    "is_overnight": false,
                    "start": "1100",
                    "end": "2300",
                    "day": 6
                }
            ],
            "hours_type": "REGULAR", //String, The type of the opening hours information. Right now, this is always REGULAR.
            "is_open_now": true //Boolean, Describe is business is open now
        }
      ]
    }
  }

  render() {
    const openStatus = this.state.hours[0].is_open_now ?
      <Text style={{color: '#C41200'}}> Open </Text>
      :
      <Text style={{color: '#79C727'}}> Closed </Text>

    const todayDayOfWeek = moment().diff(moment().startOf('week'), 'days')

    const todayHour = this.state.hours[0].open.map( day => {
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
    alignItems: 'center'
  }
})