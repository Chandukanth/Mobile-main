import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";
import Url from "../lib/Url";

class TicketService {
    async search(setIsLoading, callback) {
        try {
            setIsLoading && setIsLoading(true)

            await apiClient.get(`${endpoints().TicketApi}/search?`, (error, res) => {
                if (res.data) {
                    setIsLoading && setIsLoading(false)
                    return callback(res.data.data)
                }
            })
        } catch (err) {
            setIsLoading && setIsLoading(false)
            console.log(err);
        }
    }
    async searchTicket(params, callback) {
            try {
              let apiUrl = await Url.get(`${endpoints().TicketApi}/search`, params)
              apiClient.get(apiUrl, (err, response) => {
                return callback(null,response);
              });
        
            } catch (err) {
              console.log(err);
            }
          }
    async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().TicketApi}`, bodyData, (error, res) => {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }

    async update(id, updateData, callback) {

        apiClient.put(`${endpoints().TicketApi}/${id}`, updateData, (error, response) => {
            if (response && response.data && response.data.message) {
                return callback(null, response);
            }

        })
    }

}
const ticketService = new TicketService()
export default ticketService;