import { StyleSheet, TextInput, View } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useState } from "react";

import DateTime from "../lib/DateTime";
import Label from './Label';

const DatePicker = ({ selectedTime, onTimeSelect, format, placeholder, disabled, title }) => {

    const [TimePicker, setTimePicker] = useState(false);

    const selectedDate = selectedTime ? DateTime.UTCtoLocalTime(selectedTime, format) : "";

    function showTimePicker() {
        setTimePicker(true);
    };

    function onDateSelected(event, value) {
        onTimeSelect(value);
        setTimePicker(false);
    };

    return (
        <View style={styleSheet.MainContainer}>
            <Label text={title} bold={true} />
            <TextInput
                editable={disabled}
                showSoftInputOnFocus={false}
                onPressIn={() => showTimePicker()}
                name="time"
                value={selectedDate}
                placeholder={placeholder ? placeholder : "Select Time"}
                style={styleSheet.input}
            />

            {TimePicker && (
                <DateTimePicker
                    value={selectedTime ? selectedTime : new Date()}
                    mode={"time"}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={false}
                    onChange={onDateSelected}
                    style={styleSheet.datePicker}
                />
            )}

        </View>
    );
}

export default DatePicker;

const styleSheet = StyleSheet.create({

    MainContainer: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: 'white',
        marginVertical: 10
    },

    text: {
        fontSize: 25,
        color: 'red',
        padding: 3,
        marginBottom: 10,
        textAlign: 'center'
    },

    // Style for iOS ONLY...
    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 320,
        height: 260,
        display: 'flex',
    },
    input: {
        color: "black",
        height: 50,
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#dadae8",
    },

});