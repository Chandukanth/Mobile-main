


import apiClient from "../apiClient";

import { endpoints } from "../helper/ApiEndPoint";

class TransferTypeReasonService {

    static async search(params, callback) {
        try {

            let apiUrl = `${endpoints().TransferTypeReasonAPI}/search`;

            let queryString = [];

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString.length > 0) {
                apiUrl = `${apiUrl}?${queryString.join("&")}`;
            }

            apiClient.get(apiUrl, (error, response) => {
                return callback(null, response)
            })

        } catch (err) {
            console.log(err);
            return callback(err, [])
        }
    }

}

export default TransferTypeReasonService;