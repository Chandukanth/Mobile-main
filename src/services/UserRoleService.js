import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import ErrorMessage from "../components/error";

class UserRoleService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().userRoleAPI}/search`, params)
      apiClient.get(apiUrl, (err, response) => {
        let roleList = new Array();
        let data = response?.data?.data;
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                roleList.push({
                    
                    label : data[i].role_name,
                    value: data[i].id,


               
                });
            }
        }     
                 callback && callback(roleList);

                });
    
            } catch (err) {
              console.log(err);
            }
          }

        }
export default UserRoleService;