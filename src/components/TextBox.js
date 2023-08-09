import React from 'react';
import { StyleSheet } from 'react-native';
import TextInput from './TextInput';

const TextBox = ({
    control,
    name,
    placeholder,
    keyboardType,
    secureTextEntry,
    currency,
    required,
    title,
    editable,
    onContentSizeChange,
    containerStyle,
    onInputChange,
    values
}) => {
    return (

        <TextInput
            control={control}
            name={name}
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            currency={currency}
            required={required}
            title={title}
            style={styles.input}
            containerStyle={containerStyle}
            multiline={true}
            textAlignVertical={'top'}
            editable={editable}
            onInputChange={onInputChange}
            values={values}
            onContentSizeChange={onContentSizeChange}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'gray',
        borderRadius: 3,
        paddingHorizontal: 10,
    },
    input: {
        color: "black",
        // paddingRight: 15,
        // height: 50,
        minHeight: 150,

        borderColor: "gray",
    },
});

export default TextBox;