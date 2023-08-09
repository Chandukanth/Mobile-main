import React from 'react';
import { StyleSheet, View } from 'react-native';
import Controllers from './Controller';
import Required from './Required';
import ErrorMessage from './error';
import InputText from './InputText';
const TextInput = ({
    control,
    name,
    placeholder,
    keyboardType,
    secureTextEntry,
    currency,
    required,
    title,
    editable,
    onInputChange,
    containerStyle,
    values,
    multiline,
    onContentSizeChange,
    underlineColorAndroid,
    maxLength,
    showBorder,
    textAlignVertical
}) => {
    return (
        <Controllers
            control={control}
            name={name}
            required={required}
            placeholder={placeholder}
        >
            {({ value, onChange, onBlur, error }) => (
                <>
                    <Required title={title} required={required} />
                    <View style={styles.container}>
                    <InputText
                        currency={currency}
                        value={value}
                        values={values}
                        onBlur={onBlur}
                        editable={editable}
                        multiline={multiline}
                        placeholder={placeholder}
                        title={title}
                        style={styles.input}
                        containerStyle={containerStyle}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType}
                        onChange={onChange}
                        showBorder={showBorder}
                        onInputChange={onInputChange}
                        onContentSizeChange={onContentSizeChange}
                        underlineColorAndroid={underlineColorAndroid}
                        maxLength={maxLength}
                        textAlignVertical={textAlignVertical}
                    />
                    </View>
                    <ErrorMessage error={error} placeholder={placeholder} title={title} />
                </>
            )}
        </Controllers>
    );
};
export default TextInput;
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      width: '100%',
      borderColor: 'gray',
      borderRadius: 8,
    },
    input: {
      color: "black",
      height: 10,
      borderColor: "gray",
    },
  });