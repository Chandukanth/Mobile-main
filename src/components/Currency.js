// Import React and Component
import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,

} from "react-native";
import { Controller } from 'react-hook-form';

import Label from "./Label";
import CustomDivider from "./Divider";

const Currency = (props) => {
    const { control, placeholder, name, divider,required, onInputChange,showBorder, title, noEditable, edit,
        secureTextEntry, values
    } = props;

    const borderShow = showBorder === undefined ? true : showBorder

    return (

        <Controller
            control={control}
            name={name}
            rules={required ? { required: `Enter ${placeholder}` } : ""}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <View >
                    <View style={{ flexDirection: 'row' }}>
                        {title && <Label text={title} bold={true} />}
                        {required && <Text style={{ color: 'red', paddingHorizontal: 3 }}>*</Text>}
                    </View>

                    <View
                        style={[
                            styles.container,
                            { borderColor: error ? 'red' : noEditable ? '#D3D3D3' : 'gray', borderWidth: borderShow ? 1 :  0 }, !title && { marginVertical: 12 }
                        ]}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text style={styles.prefix}>₹</Text>
                            <TextInput
                                value={values || value}
                                onBlur={onBlur}
                                editable={noEditable ? false : edit ? true : false}
                                placeholder={placeholder || title}
                                style={styles.input}
                                secureTextEntry={secureTextEntry}
                                keyboardType={'numeric'}
                                onChangeText={(e) => {
                                    onChange(e);
                                    onInputChange && onInputChange(e);
                                }} />

                        </View>

                    </View>
                    {divider && (
                    <CustomDivider />
                    )}

                    {error && (
                        <Text style={{ color: 'red', alignSelf: 'stretch' }}>{`Enter ${placeholder ? placeholder : title}`}</Text>
                    )}
                </View>
            )}
        />


    )
}

export default Currency;

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: "white",
        flexDirection: 'row'
    },
    prefix: {
        marginTop: 16,
        paddingRight: 10
    },
    input: {
        color: "black",
        paddingRight: 15,
        height: 50,
        borderColor: "gray",
        flex: 1
    },
});
