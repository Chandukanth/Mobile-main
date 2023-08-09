import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class ShiftService {

    async getShiftList(params, callback) {
        try {

            apiClient.get(Url.get(`${endpoints().ShiftAPI}/list`, params),(error, response)=> {

                return callback(null, response);

            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }
}

const shiftService = new ShiftService();

export default shiftService;