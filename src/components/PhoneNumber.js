import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';
import ErrorMessage from './error';
import Required from './Required';

const PhoneNumber = ({
    control,
    name,
    placeholder,
    currency,
    required,
    title,
    editable,
    values,
}) => {
    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters from the input value
        const formattedValue = value.replace(/\D/g, '');

        // Format the phone number in (XXX) XXX-XXXX format
        let formattedPhoneNumber = '';
        if (formattedValue.length > 0) {
            formattedPhoneNumber = '(' + formattedValue.slice(0, 3);
        }
        if (formattedValue.length > 3) {
            formattedPhoneNumber += ') ' + formattedValue.slice(3, 6);
        }
        if (formattedValue.length > 6) {
            formattedPhoneNumber += '-' + formattedValue.slice(6, 10);
        }

        return formattedPhoneNumber;
    };

    return (
        <>
            <Controller
                control={control}
                name={name}
                rules={!values &&{
                    pattern: {
                        value: /^\(\d{3}\) \d{3}-\d{4}$/,
                        message: 'Invalid Phone Number',
                    },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <>
                        <Required title={title} required={required} />

                        <View
                            style={[
                                styles.container,
                                { borderColor: error ? 'red' : 'gray', borderWidth: currency ? 0 : 1 },
                            ]}
                        >
                            <TextInput
                                value={formatPhoneNumber(value || values)}
                                onBlur={onBlur}
                                editable={editable && true}
                                placeholder={placeholder || title}
                                style={styles.input}
                                onChangeText={(e) => {
                                    onChange(formatPhoneNumber(e));
                                }}
                                underlineColorAndroid="transparent"
                                keyboardType="phone-pad"
                            />
                        </View>
                        {error && <ErrorMessage placeholder={placeholder} title={title} validate={true} />}
                    </>
                )}
            />
        </>
    );
};

export default PhoneNumber;

const styles = StyleSheet.create({
    input: {
        color: 'black',
        height: 47,
        borderColor: 'gray',
        paddingLeft: 8
    },
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'gray',
        borderRadius: 8,
    },
});
