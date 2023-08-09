import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import TransferType from "../helper/TransferType";

class TransferTypeService {

    async search(params, callback) {
        const queryString = [];
        let apiUrl;

        if (params) {
            Object.keys(params).forEach((param) => {
                queryString.push(`${param}=${params[param]}`);
            });
        }

        if (queryString && queryString.length > 0) {
            apiUrl = `${endpoints().TransferTypeApi}/search?${queryString.join("&")}`;
        } else {
            apiUrl = `${endpoints().TransferTypeApi}/search`;
        }

        let lists = [];

        apiClient.get(apiUrl, (error, res) => {
            const transferTypes = res.data.data;
            if (transferTypes && transferTypes.length > 0) {
                transferTypes.forEach((transferType) => {
                    lists.push({
                        id: transferType.id,
                        value: transferType.id,
                        label: transferType.name,
                        fromStore: {
                            label: transferType.default_from_store,
                            value: transferType.default_from_store_id
                        },
                        allow_to_change_to_store: transferType.allow_to_change_to_store,
                        allow_to_change_from_store: transferType.allow_to_change_from_store,

                        toStore: {
                            label: transferType.default_to_store,
                            value: transferType.default_to_store_id
                        },
                        offlineMode: transferType.offline_mode == TransferType.OFFLINE_MODE ? true : false
                    });

                });
            }

            return callback(lists);

        })
    };

    async searchByRole(params, callback) {
        try {
            const queryString = [];

            let apiUrl;

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString && queryString.length > 0) {
                apiUrl = `${endpoints().TransferTypeApi}/searchByRole?${queryString.join("&")}`;
            } else {
                apiUrl = `${endpoints().TransferTypeApi}/searchByRole`;
            }

            apiClient.get(apiUrl, (error, res) => {
                return callback(null, res);

            })
        } catch (err) {
            return callback(err, null);
        }
    };


}

const transferTypeService = new TransferTypeService();

export default transferTypeService;
