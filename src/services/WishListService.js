import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from "react-native-simple-toast";
import AlertModal from "../components/Alert";

class WishListProductService {

    async addProduct(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().WishListAPI}`, bodyData,(error, res)=> {
                    if (res.data && res.data.message) {
                        Toast.show(res.data.message, Toast.LONG);
                    }
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }

    async deleteWishListProduct(id, callback) {
        try {
          if (id) {
    
    
            // apiClient
            apiClient.delete(`${endpoints().WishListAPI}/${id}`,(error, res)=> {
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

    async getProductList(params, callback) {
        try {
            const queryString = [];

            let apiUrl = `${endpoints().WishListAPI}/search`

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString.length > 0) {
                apiUrl = `${apiUrl}?${queryString.join("&")}`;
            }
            
            let productList = new Array();

            apiClient.get(apiUrl,(error, res) => {
                if (res && res.data && res.data.data) {
                    productList = res.data.data;
                }
                return callback(null, productList);

            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }
}
const wishListProductService = new WishListProductService();

export default wishListProductService;
