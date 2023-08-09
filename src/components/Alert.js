

import { Alert } from "react-native";

const AlertModal = (type, message) =>

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
export default AlertModal;
