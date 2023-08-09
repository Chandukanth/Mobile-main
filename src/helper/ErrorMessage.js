import Toast from 'react-native-simple-toast';
import AsyncStorage from "../lib/AsyncStorage";
import AlertModal from '../components/Alert';
export function ErrorMessage(error, navigation) {
    console.log(error);
    let errorMessage;
    const errorRequest = error?.response?.request;
    if (errorRequest && errorRequest.status === 401) {
        errorMessage = JSON.parse(errorRequest.response).message;
        AsyncStorage.clear()
        AlertModal("Error",errorMessage);
        navigation.navigate("Login")
    } else {
        if (errorRequest) {
            errorMessage = JSON.parse(errorRequest?.response).message;
            AlertModal("Error",errorMessage);
        }
    }
}