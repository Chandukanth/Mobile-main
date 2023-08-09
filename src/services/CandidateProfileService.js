import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Url from "../lib/Url";

class CandidateProfileService {
  static async search(params, callback) {
    try {
      let apiUrl = await Url.get(`${endpoints().CandidateProfile}/list`, params)
      apiClient.get(apiUrl, (err, response) => {
        // Set response in state
        callback && callback(response);
      });

    } catch (err) {
      console.log(err);
    }
  }
  static async create(createData, callback) {
    apiClient.post(`${endpoints().CandidateProfile}`, createData, (error, response) => {
      return callback(null, response);
    })
  }
  static async update(id, updateData, callback) {
    apiClient.put(`${endpoints().CandidateProfile}/${id}`, updateData, (error, response) => {
      return callback(response.data.message);

    })
  }


}



export default CandidateProfileService;;