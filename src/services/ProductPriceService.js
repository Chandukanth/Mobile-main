
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";


class ProducPriceService {
   static async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().ProductPrice}`, bodyData,(error, res)=> {
                    return callback &&  callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }
}
export default ProducPriceService;