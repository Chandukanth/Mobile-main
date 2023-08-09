import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";

class FineService{
   
  async search(params, callback) {
    try {
      const queryString = [];

      let apiUrl;

      if (params) {
        Object.keys(params).forEach((param) => {
          queryString.push(`${param}=${params[param]}`);
        });
      }

      if (queryString && queryString.length > 0) {
        apiUrl = `${endpoints().FineApi}/search?${queryString.join("&")}`;
      } else {
        apiUrl = `${endpoints().FineApi}/search`;
      }


      apiClient
        .get(apiUrl, (error, response) => {
          return callback(null, response);
        })
    } catch (err) {
      return callback(err, null);

    }
  }
  async searchFine(setIsLoading, callback) {
    try {
      setIsLoading && setIsLoading(true);

      await apiClient.get(
        `${endpoints().FineApi}/search?sort=createdAt&sortDir=DESC&pagination=true`,
        (error, res) => {
          if (res.data.data) {
            setIsLoading && setIsLoading(false);

            return callback(res.data.data)
          }
        }
      );
    } catch (err) {
      setIsLoading && setIsLoading(false);
      console.log(err);
    }
  }

    
  
    async create(bodyData, callback) {
        try {
            if (bodyData) {
                apiClient.post(`${endpoints().FineApi}`, bodyData,(error, res)=> {

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
    async update(id,updateData,callback) {
        try {
            apiClient.put(`${endpoints().FineApi}/${id}`, updateData,(error, res)=> {
                if (res && res.data && res.data.message) {
                  Toast.show(res.data.message, Toast.LONG);
                }
                return callback(null, res)
          
              })
        }
      catch (err) {
            console.log(err);
        }
    }
    async get(setIsLoading, callback) {
        try {
            setIsLoading && setIsLoading(true)
            await apiClient.get(`${endpoints().FineApi}/search?page=1&pageSize=25&sort=createdAt&sortDir=DESC&pagination=true`,(error, res) => {
                if (res.data.accountspurchase) {
                    setIsLoading && setIsLoading(false)
                    return callback(res.data.accountspurchase)
                }
            })
        } catch (err) {
            setIsLoading && setIsLoading(false)
            console.log(err);
        }
    }

    async delete(id,callback) {
        try {
            apiClient.delete(`${endpoints().FineApi}/${id}`, (error, response)=> {
                if (response && response.data && response.data.message) {
                return callback(response.data.message);
                                }

          
              })
        }
      catch (err) {
            console.log(err);
        }
    }
}

const fineService = new FineService()
export default fineService;
