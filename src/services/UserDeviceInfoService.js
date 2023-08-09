
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";


class UserDeviceInfoService {
    async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().UserDeviceInfoApi}/create`, bodyData,(error, res)=> {
                    return callback &&  callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }
}
const userDeviceInfoService = new UserDeviceInfoService();
export default userDeviceInfoService;