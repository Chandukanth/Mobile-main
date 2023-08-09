

import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class TicketCommentService {

    static async create(id, bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().TicketComment}/${id}`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }
    static async search(params, callback) {
        try {
            let apiUrl = await Url.get(`${endpoints().TicketComment}/search`, params)
            apiClient.get(apiUrl, (err, response) => {
                // Set response in state
                callback && callback(response);
            });

        } catch (err) {
            console.log(err);
        }
    }
    static async delete(id, comment_id, callback) {
        try {
            if (id) {

                apiClient
                    .delete(`${endpoints().TicketComment}/${id}/${comment_id}`, (error, res) => {
                        return callback(null, res);
                    })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }
    static async update(messageId, bodyData, callback) {
        apiClient.put(`${endpoints().TicketComment}/${messageId}`, bodyData, (error, response) => {
            return callback(response);
        })
    }
}


export default TicketCommentService;