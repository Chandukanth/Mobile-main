import React from "react";
import {StyleSheet, Text} from 'react-native';
import { Color } from "../helper/Color";
const DateText=(props)=>{
    const { date } = props

    return (

    <Text style={[styles.date]}>
        {date}
  </Text>
    )
}
export default DateText
const styles = StyleSheet.create({

date: {
    fontSize: 14,
    color: Color.GREY,
},
})