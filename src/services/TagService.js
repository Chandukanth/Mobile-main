import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { ErrorMessage } from "../helper/ErrorMessage";
import AlertModal from "../components/Alert";
import Url from "../lib/Url";

class TagService {

    
    async list(params,callback) {

          try {
            let apiUrl = await Url.get(`${endpoints().productTagAPI}/list`, params)
            apiClient.get(apiUrl, (err, response) => {
              return callback(null,response);
            });
      
          } catch (err) {
            console.log(err);
          }

    }

    async search(params,callback) {

      try {
        let apiUrl = await Url.get(`${endpoints().productTagAPI}/search`, params)
        apiClient.get(apiUrl, (err, response) => {
          return callback(null,response);
        });
  
      } catch (err) {
        console.log(err);
      }

}
    async get(callback) {
        try {

            apiClient.get(`${endpoints().productAPI}/${userId}`,(error, response) => {
                if (response.data && response.data) {
                    return callback(null, response);
                }
            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }

    }
}

const tagService = new TagService();

export default tagService;