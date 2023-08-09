import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";

class StoreProductService {

    async searchProduct(params, callback) {
        try {

            let apiUrl;

            let StoreProductList = new Array();

            const queryString = [];

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            apiUrl = `${endpoints().storeProductAPI}/search?${queryString.join("&")}`;

            if (apiUrl) {

                apiClient.get(apiUrl, (error, response) => {

                    return callback(error, response);
                })

            }
        } catch (err) {
            return callback(err, null);
        }
    }

    async search(params, callback) {
        try {

            let apiUrl;

            const queryString = [];

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            apiUrl = `${endpoints().storeProductAPI}/search?${queryString.join("&")}`;


            if (apiUrl) {

                apiClient.get(apiUrl, (error, response) => {
                    return callback(null, response);
                })

            }
        } catch (err) {
            return callback(err, null);
        }
    }

    async update(storeProductId, updateData, callback) {
        try {
            apiClient.put(`${endpoints().storeProductAPI}/${storeProductId}`, updateData, (error, response) => {
                return callback(null, response);
            })

        } catch (err) {
            return callback(err, null);
        }
    }

    async replenishSearch(params, callback) {
        try {

            let apiUrl;

            const queryString = [];

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            apiUrl = `${endpoints().storeProductAPI}/replenish/search?${queryString.join("&")}`;

            if (apiUrl) {

                apiClient.get(apiUrl, (error, response) => {
                    return callback(null, response);
                })

            }
        } catch (err) {
            return callback(err, null);
        }
    }

}

const storeProductService = new StoreProductService();

export default storeProductService;