import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class PaymentService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().PaymentApi}/search`, params)
      apiClient.get(apiUrl, (err, response) => {
        // Set response in state
        callback && callback(response);
      });

    } catch (err) {
      console.log(err);
    }
  }
  static async create(bodyData, callback) {
    try {
      if (bodyData) {

        apiClient.post(`${endpoints().PaymentApi}`, bodyData, (error, res) => {
          return callback && callback(null, res)
        })
      }

    } catch (err) {
      console.log(err);
      return callback(err, "")
    }
  }
  static async update(id, bodyData, callback) {
    try {
      if (id) {

        apiClient.put(`${endpoints().PaymentApi}/update/${id}`, bodyData, (error, res) => {
          return callback && callback(null, res)
        })
      }

    } catch (err) {
      console.log(err);
      return callback(err, "")
    }
  }
  static async delete(id, callback) {
    try {
      if (id) {
        apiClient.delete(`${endpoints().PaymentApi}/delete/${id}`, (error, res) => {
          return callback(null, res);
        })
      }
    } catch (err) {
      console.log(err);
      return callback(err, null);
    }
  }

}



export default PaymentService;;