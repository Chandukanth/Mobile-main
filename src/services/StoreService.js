

import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import { ErrorMessage } from "../helper/ErrorMessage";

class StoreService {

  // Get inventory transfer∂ß list
  async getStoreList(navigation, callback) {
    try {

      apiClient.get(`${endpoints().locationAPI}/search?status=Active`, (error, response) => {
        if (response) {
          return callback(null, response);
        }
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };

  async GetStoreByIpAddress(callback) {
    try {

      apiClient.get(`${endpoints().locationAPI}/ipAddress`, (error, response) => {
        if (response) {
          return callback(null, response);
        }
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };

  async get(storeId, callback) {
    try {
      apiClient.get(`${endpoints().locationAPI}/${storeId}`, (error, response) => {
        return callback(null, response);
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };


  async GetStoreList(params, callback) {

    try {
      let apiUrl;

      let queryString = [];
      if (params) {
        for (let key in params) {
          queryString.push(`${key}=${params[key]}`);
        }
      }
      if (queryString.length > 0) {
        apiUrl = `${endpoints().locationAPI}/search?${queryString.join("&")}`;
      } else {
        apiUrl = `${endpoints().locationAPI}/search`;
      }

      apiClient.get(apiUrl, (error, response) => {

        let storeList = new Array();
        let data = response?.data?.data;
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            storeList.push({
              label: data[i].name,
              value: data[i].id,
            });
          }
        }
        // Set response in state
        callback && callback(storeList);

      });

    } catch (err) {
      console.log(err);
    }
  }


  // Get inventory transfer∂ß list
  async list(callback) {
    try {
      apiClient.get(`${endpoints().locationAPI}/list`, (error, response) => {
        if (response) {
          return callback(null, response);
        }
      })

    } catch (err) {
      console.log(err);
      return callback(err, []);
    }
  };

  processList = (storeList) => {
    const storeListOption = new Array();
    if (storeList && storeList.length > 0) {
      for (let i = 0; i < storeList.length; i++) {
        storeListOption.push({
          label: storeList[i].name,
          value: storeList[i].id,
        });
      }

      return storeListOption;
    }
  }

}

const storeService = new StoreService();

export default storeService;