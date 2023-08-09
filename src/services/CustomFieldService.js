import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";


class CustomFormFieldDataService {

  static search(params, callback) {
    try {

      let url = Url.get(
        `${endpoints().CustomField}/search`,
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

}

export default CustomFormFieldDataService;
