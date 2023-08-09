import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import ErrorMessage from "../components/error";

class VisitorService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().VisitorApi}/search`, params)
      apiClient.get(apiUrl, (err, response) => {
        // Set response in state
        callback && callback(response);
      });

    } catch (err) {
      console.log(err);
    }
  }
 
  static async update(id, updateData, callback) {
    apiClient.put(`${endpoints().VisitorApi}/${id}`, updateData, (error, response) => {
      return callback(response.data.message);

    })
  }


  static async create( bodyData, callback) {
    try {
      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );

      fetch(`${endpoints().VisitorApi}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: sessionToken,
        },
        body: bodyData,
      })
        .then((res) =>{
          return callback(null, res);
        } )
        .catch(error => {
          ErrorMessage(error, navigation)
          return callback(error, null);
        });
       
    } catch (err) {
      return callback(err, null);
    }
  }


}



export default VisitorService;;