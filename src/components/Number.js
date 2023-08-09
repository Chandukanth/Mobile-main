import React from 'react';
import { StyleSheet } from 'react-native';

import TextInput from "./TextInput"
import CustomDivider from './Divider';

const Number = ({
    control,
    name,
    placeholder,
    secureTextEntry,
    currency,
    divider,
    required,
    title,
    editable,
    showBorder,
    values,
    onInputChange,
}) => {
    return (
        <>

        <TextInput
            control={control}
            name={name}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            currency={currency}
            required={required}
            showBorder={showBorder}
            title={title}
            editable={editable}
            values={values}
            onInputChange={onInputChange}
            keyboardType={"numeric"}
            style={styles.input}
        />
        {divider && (
            <CustomDivider/>

        )}
        </>


    );
};



export default Number;
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    input: {
        color: "black",
        paddingRight: 15,
        height: 50,
        borderColor: "gray",
       
    },
});