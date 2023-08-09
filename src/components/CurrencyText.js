import React from "react";
import { StyleSheet, Text } from 'react-native';
import Currency from "../lib/Currency";
const CurrencyText = (props) => {
    const { amount } = props
    return (
        <Text style={styles.currency}> {Currency.IndianFormat(amount)}</Text>
    )
}
export default CurrencyText
const styles = StyleSheet.create({
    currency :{
        fontSize: 14,
       fontWeight:"bold"
},
})
