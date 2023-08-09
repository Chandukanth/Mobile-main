import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import Url from "../lib/Url";

class AccountService {
  async GetList(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().accountAPI}/list`, params)
      apiClient.get(apiUrl, (error, response) => {
        let vendorList = new Array();
        let data = response?.data?.data;
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            vendorList.push({
              label: data[i].name,
              value: data[i].id,
            });
          }
        }
        // Set response in state
        callback && callback(vendorList);

      });

    } catch (err) {
      console.log(err);
    }
  }

}


const accountService = new AccountService();

export default accountService;