

import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";

class JobsService {

    static async search(callback) {
        try {
            apiClient.get(`${endpoints().Jobs}/list`, (error, response) => {
                if (response) {
                    return callback(null, response);
                }
            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    };

}


export default JobsService;