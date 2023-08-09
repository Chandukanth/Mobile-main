


import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";

class RoleService {

    async getPermissionList(callback) {
        try {

                apiClient.get(
                    `${endpoints().PermissionAPI}/list`
                    , (error, response) => {

                        //validate response exist or not
                        if (response && response.data && response.data.data) {

                            return callback(null, response)

                        }
                    })

        } catch (err) {
            console.log(err);
            return callback(err, [])
        }
    }

}

const roleService = new RoleService();

export default roleService;