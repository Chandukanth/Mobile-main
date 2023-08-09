import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class CustomFieldValueService {

  static search(params, callback) {
    try {

      let url = Url.get(
        `${endpoints().CustomFieldValue}/search`,
        params
      );
      apiClient.get(url, (error, response) => {
        return callback(null, response);
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }

  }

  static create(body, callback) {
    try {
      apiClient.post(`${endpoints().CustomFieldValue}`, body, (error, response) => {
        return callback(null, response);
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }

  }

  static get(id, params, callback) {
    try {
      let url = Url.get(
        `${endpoints().CustomFieldValue}/${id}`,
        params
      );

      apiClient.get(url, (error, response) => {
        return callback(null, response);
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }

  }


  static update(body, callback) {
    try {
      apiClient.put(`${endpoints().CustomFieldValue}`, body, (error, response) => {
        return callback(null, response);
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }

  }

}

export default CustomFieldValueService;
