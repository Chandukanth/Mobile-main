import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class CompanyService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().companyAPI}`, params)
      apiClient.get(apiUrl, (err, response) => {
        // Set response in state
        callback && callback(response);
      });

    } catch (err) {
      console.log(err);
    }
  }

}



export default CompanyService;;