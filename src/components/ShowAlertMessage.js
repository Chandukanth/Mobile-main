

import { Alert } from "react-native";

export const showAlert = (type, message) => {
    Alert.alert(
        type == "Success" ? "Success Message" : "Error Message",
        message,
        [
            {
                text: 'OK',
            },
        ],
        { cancelable: false }
    );
};