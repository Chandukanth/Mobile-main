import React from "react";
import { Text } from "react-native";
const ErrorMessage = ({ placeholder, title, error, validate }) => {
    return (
        <>
            {error && (
                <Text style={{ color: 'red', alignSelf: 'stretch' }}>{`Enter ${placeholder ? placeholder : title}`}</Text>
            )}
            {validate && (
                <Text style={{ color: 'red', alignSelf: 'stretch' }}>{`Invalid ${title}`}</Text>
            )}
        </>
    )
}
export default ErrorMessage