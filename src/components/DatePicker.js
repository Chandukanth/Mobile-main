import { StyleSheet, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from "react";
import DateTime from "../lib/DateTime";
import Label from './Label';
import CustomDivider from './Divider';
import { Controller } from 'react-hook-form';

const DatePicker = ({ selectedDate, onDateSelect, style, divider, format, disabled, title, showTime, name, control, isForm, required }) => {
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState("");

    let date =   selectedDateTime ?  DateTime.UTCtoLocalTime(selectedDateTime, (format ? format : "DD-MMM-YYYY")) : selectedDate ? DateTime.UTCtoLocalTime(selectedDate, (format ? format : "DD-MMM-YYYY")) : "";

    const time = selectedDate ? DateTime.UTCtoLocalTime(selectedDate, "hh:mm A") : "";

    function showDatePicker() {
        setDatePickerVisible(true);
    };

    function showTimePicker() {
        setTimePickerVisible(true);
    };

    function onDateSelected(event, value) {
        setDatePickerVisible(false);
        onDateSelect(value);
    };

    function onTimeSelected(event, value) {
        setTimePickerVisible(false);
        onDateSelect(value);
    };

    return (
        <View style={styleSheet.MainContainer}>
            <View style={{ paddingBottom: 2 }}>
                {title && <Label text={title} bold={true} />}
            </View>
            <View style={{ flexDirection: showTime ? 'row' : 'column' }}>
                <TextInput
                    editable={disabled}
                    showSoftInputOnFocus={false}
                    onPressIn={() => showDatePicker()}
                    name="date"
                    value={date}
                    placeholder="Select Date"
                    style={[style ? style : styleSheet.input, { width: showTime ? '50%' : '100%' }]}
                />
                {divider && (
                    <CustomDivider />
                )}
                {showTime && (
                    <TextInput
                        editable={disabled}
                        showSoftInputOnFocus={false}
                        onPressIn={() => showTimePicker()}
                        name="time"
                        value={time}
                        placeholder="Select Time"
                        style={[styleSheet.input, { width: '50%' }]}
                    />
                )}
            </View>

            {datePickerVisible && (
                <>
                    {isForm ? (
                        <Controller
                            control={control}
                            name={name}
                            rules={required ? { required: `Enter ${placeholder}` } : ""}
                            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
                                return (
                                    <>
                                        <DateTimePicker
                                            value={value ? new Date(value) : new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={(event, date) => { 
                                                setDatePickerVisible(false); 
                                                setSelectedDateTime(date)
                                                onChange(date);
                                            }}
                                            style={styleSheet.datePicker}
                                        />
                                    </>
                                )

                            }}
                        />
                    ) : (
                        <DateTimePicker
                            value={selectedDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateSelected}
                            style={styleSheet.datePicker}
                        />
                    )}
                </>
            )}

            {showTime && timePickerVisible && (
                <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    format="hh:mm A"
                    onChange={onTimeSelected}
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
        backgroundColor: 'white',
        paddingTop: 3
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

    datePicker: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: 320,
        height: 260,
        display: 'flex',
    },
});
