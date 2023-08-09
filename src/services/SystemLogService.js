import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";

class SystemLogService{
    async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().SystemLogApi}/create`, bodyData,(error, res)=> {
                    return callback &&  callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }
}
const systemLogService = new SystemLogService()
export default systemLogService;
