
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";


class UserLocationService {
   static async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().UserLocationApi}/create`, bodyData,(error, res)=> {
                    return callback &&  callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }
}
export default UserLocationService;