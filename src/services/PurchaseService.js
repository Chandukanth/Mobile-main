import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";

class PurchaseService {
    async getPurchase(setIsLoading, callback) {
        try {
            setIsLoading && setIsLoading(true)
            await apiClient.get(`${endpoints().PurchaseAPI}/search`,(error, res) => {
                if (res.data.accountspurchase) {
                    setIsLoading && setIsLoading(false)
                    return callback(res.data.accountspurchase)
                }
            })
        } catch (err) {
            setIsLoading && setIsLoading(false)
            console.log(err);
        }
    }

    async createPurchase(createData, callback) {

        apiClient.post(`${endpoints().PurchaseAPI}`, createData,(error, response) => {
            return callback(null, response);

        })
    }

    async updatePurchase(id, updateData, callback) {

        apiClient.put(`${endpoints().PurchaseAPI}/${id}`, updateData,(error, response)=> {
            return callback(response.data.message);

        })
    }

    async Delete(id, callback) {
        try {
            if (id) {


                // apiClient
                apiClient.delete(`${endpoints().PurchaseAPI}/${id}`, (error, res) => {
                   
                    return callback();
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

}
const purchaseService = new PurchaseService()

export default purchaseService