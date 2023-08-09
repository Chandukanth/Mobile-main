import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class InspectionService {

  static search(params, callback) {
    try {

      let url = Url.get(
        `${endpoints().InspectionApi}/search`,
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

  static create(bodyData, callback) {
    try {
      apiClient
        .post(`${endpoints().InspectionApi}/create`, bodyData, (error, response) => {
            return callback(null, response);
        })
    } catch (err) {
      console.log(err);
    }
  }

}

export default InspectionService;
