import apiClient from "../apiClient";

import { endpoints } from "../helper/ApiEndPoint";
class AddressServices {
  async search(params, callback) {

    try {
      let apiUrl;

      let queryString = [];
      if (params) {
        for (let key in params) {
          queryString.push(`${key}=${params[key]}`);
        }
      }
      if (queryString.length > 0) {
        apiUrl = `${endpoints().addressAPI}/search?${queryString.join("&")}`;
      } else {
        apiUrl = `${endpoints().addressAPI}/search`;
      }

      apiClient.get(apiUrl, (error, response) => {
        let addressList = new Array();
        let data = response?.data?.data;
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            addressList.push({
              label: data[i].title + "" + `, (${data[i].name})`,
              value: data[i].title + "" + `, (${data[i].name})`,
            });
          }
        }
        // Set response in state
        callback && callback(addressList);
      });

    } catch (err) {
      console.log(err);
    }
  }


}
const addressServices = new AddressServices;

export default addressServices;