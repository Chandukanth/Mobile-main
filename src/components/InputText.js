
import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
const InputText = (props) => {
    const { error,
        currency,
        value,
        values,
        onBlur,
        editable,
        placeholder,
        title,
        secureTextEntry,
        keyboardType,
        onChange,
        onInputChange,
        handleContentSizeChange,
        containerRef,
        handleLayout,
        containerStyle,
        style,
        styles,
        maxLength,
        showBorder,
        multiline,
        textAlignVertical

    } = props
    const borderShow = showBorder === undefined ? true : showBorder

    return (
        <View
            style={[
                containerStyle ? containerStyle : Sheet.container,
                { borderColor: error && 'red', borderWidth: currency ? 0 : borderShow ? 1 : 0 },
            ]}>
            <TextInput
                value={value || values}
                onBlur={onBlur}
                editable={editable && true}
                placeholder={placeholder || title}
                style={styles}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onChangeText={(e) => {
                    onChange(e);
                    onInputChange && onInputChange(e);
                }}
                multiline={multiline}
                textAlignVertical={textAlignVertical}
                onContentSizeChange={handleContentSizeChange}
                maxLength={maxLength}
                underlineColorAndroid={'transparent'}
            />
            <View
                ref={containerRef}
                onLayout={handleLayout}
                style={style}
            >
            </View>
        </View>
    )
}
export default InputText
const Sheet = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingTop:10

    },
    input: {
        color: "black",
        paddingRight: 15,
        height: 20,
        borderColor: "gray",
    },
});