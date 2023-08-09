import { Alert } from "react-native";
class AlertMessage {
    async Error(Message, onDismiss) {
       
        let buttonObject = {
            text: 'OK'
        }

        if (onDismiss) {
            buttonObject.onPress = onDismiss
        }
        
        Alert.alert(
            "Error",
            Message,
            [
                buttonObject,
            ],
            { cancelable: true },

        );
    }

    async Success(Message) {
        Alert.alert(
            "Success",
            Message,
            [
                {
                    text: 'OK',
                },
            ],
            { cancelable: false }
        );
    }



}
const alert = new AlertMessage()
export default alert;