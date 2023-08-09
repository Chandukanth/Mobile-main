import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'

const RadioButton = ({ label, value, checked, onPress }) => {

    return (
        <TouchableOpacity style={styles.radioButton} onPress={onPress}>
            <View style={styles.radioButtonCircle}>
                {checked && <View style={styles.radioButtonCheckedCircle} />}
            </View>
            <Text style={{paddingLeft:10, paddingTop:2}}>{label}</Text>
        </TouchableOpacity>
    )

}
export default RadioButton;

const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 15,
    },
    radioButtonCircle: {
        height: 25,
        width: 25,
        borderRadius: 14,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    radioButtonCheckedCircle: {
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: '#000',

    },
})