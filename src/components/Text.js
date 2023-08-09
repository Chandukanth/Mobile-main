import React from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";

const Text = ({ onChange, placeholder, name,value, secureTextEntry,showSoftInputOnFocus }) => {

    return (
            <View style={{paddingVertical : 10}}>
                <TextInput
                    showSoftInputOnFocus={showSoftInputOnFocus ? showSoftInputOnFocus : true}
                    name = {name}
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder={placeholder}
                    keyboardType="default"
                    secureTextEntry={secureTextEntry}
                />
            </View>
    );
};

const styles = StyleSheet.create({
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

export default Text;