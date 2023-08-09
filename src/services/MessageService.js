

import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class MessageService {

    async SendMessage(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().MessageAPI}/create`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }

    async get(reciever_user_id, callback) {
        try {
            if (reciever_user_id) {

                apiClient.get(`${endpoints().MessageAPI}/${reciever_user_id}`, (error, response) => {
                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }
    async search(callback) {
        try {

            apiClient.get(`${endpoints().MessageAPI}/search`, (error, response) => {
                if (response.data && response.data) {
                    return callback(null, response);
                }
            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }

    }

    async unRead(callback) {
        try {

            apiClient.get(`${endpoints().MessageAPI}/unRead`, (error, response) => {
                if (response.data && response.data) {
                    return callback(null, response);
                }
            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }

    }
    async update(id, messageId, callback) {
        apiClient.put(`${endpoints().MessageAPI}/${id}/${messageId}`, null, (error, response) => {
            return callback(response);
        })
    }
}

const messageService = new MessageService();

export default messageService;