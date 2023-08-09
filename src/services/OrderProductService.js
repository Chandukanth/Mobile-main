import apiClient from "../apiClient";

import { endpoints } from "../helper/ApiEndPoint";

class OrderProductService{

    static async search(params, callback) {
        try {
          const queryString = [];
    
          let apiUrl;
    
          if (params) {
            Object.keys(params).forEach((param) => {
              queryString.push(`${param}=${params[param]}`);
            });
          }
    
          if (queryString && queryString.length > 0) {
            apiUrl = `${endpoints().orderProductAPI}/search?${queryString.join("&")}`;
          } else {
            apiUrl = `${endpoints().orderProductAPI}/search`;
          }
    
          apiClient
            .get(apiUrl, (error, response) => {
              return callback(null, response);
            })
        } catch (err) {
          return callback(err, null);
    
        }
      }

      static async replenishSearch(params, callback) {
        try {
          const queryString = [];
    
          let apiUrl;
    
          if (params) {
            Object.keys(params).forEach((param) => {
              queryString.push(`${param}=${params[param]}`);
            });
          }
    
          if (queryString && queryString.length > 0) {
            apiUrl = `${endpoints().orderProductAPI}/replenish/search?${queryString.join("&")}`;
          } else {
            apiUrl = `${endpoints().orderProductAPI}/replenish/search`;
          }
    
          apiClient
            .get(apiUrl, (error, response) => {
              return callback(null, response);
            })
        } catch (err) {
          return callback(err, null);
    
        }
      }

}

export default OrderProductService;