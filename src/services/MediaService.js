
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import apiClient from "../apiClient";
import { ErrorMessage } from "../helper/ErrorMessage";
import AlertModal from "../components/Alert";


class MediaService {

  async search(id, object, callback) {
    try {

      const queryString = [];

      let params = { object_id: id, objectName: object, page: 1, sort: "createdAt", sortDir: "DESC" }

      let apiUrl;

      if (params) {
        Object.keys(params).forEach((param) => {
          queryString.push(`${param}=${params[param]}`);
        });
      }

      apiUrl = `${endpoints().MediaAPI}/search?${queryString.join("&")}`;

      apiClient.get(apiUrl, (error, response) => {
        callback && callback(response)
      })
    } catch (err) {
      console.log(err);
    }
  }

  async uploadMedia(navigation, bodyData, callback) {
    try {
      //get session token 
      let sessionToken = await AsyncStorage.getItem(
        AsyncStorageConstants.SESSION_TOKEN
      );

      fetch(`${endpoints().MediaAPI}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: sessionToken,
        },
        body: bodyData,
      })
        .then(res => res.json())
        .then(response => {
          return callback(null, response);
        })
        .catch(error => {
          ErrorMessage(error, navigation)
          return callback(error, null);
        });
    } catch (err) {
      return callback(err, null);
    }
  }


  async addMedia(bodyData, callback) {
    try {



      apiClient.post(`${endpoints().MediaAPI}`, bodyData, (error, response) => {

        return callback(null, response);

      })

    } catch (err) {
      console.log(err);
      return callback(err, null);
    }

  }

  async deleteMedia(id, callback) {
    try {
      if (id) {
        // apiClient
        apiClient.delete(`${endpoints().MediaAPI}/${id}`, (error, res) => {
          if (res.data) {
            if (res.data.message) {
              Toast.show(res.data.message, Toast.LONG);
            }
          }
          return callback();
        })
      }
    } catch (err) {
      console.log(err);
      return callback(err, null);
    }
  }

}

const mediaService = new MediaService();

export default mediaService;