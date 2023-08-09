import React from "react";
import { StyleSheet, Text } from 'react-native';
const StoreText = (props) => {
    const { locationName } = props
    return (
        <Text style={styles.name}>{locationName}</Text>
    )
}
export default StoreText
const styles = StyleSheet.create({
    name :{
        fontSize: 14,
       fontWeight:"bold"
},
})