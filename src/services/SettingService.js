
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import OnePortalDB from "../lib/SQLLiteDB";
import Setting from "../lib/Setting";
import Url from "../lib/Url";

class SettingService {

    async GetStoreId(callback) {
        try {
            let setting = await OnePortalDB.runQuery(OnePortalDB.DB, `SELECT * FROM setting WHERE name ='${Setting.STORE_ID_SETTING}'`);
            callback && callback(setting[0].value)
        } catch (err) {
            console.log(err)
        }

    }
    async get(name, callback, object_id) {
        try {

            apiClient.get(Url.get(`${endpoints().SettingAPI}`, { name: name }), (error, response) => {

                return callback(null, response.data);

            }, {object_id : object_id && object_id})

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }
}
const settingService = new SettingService;

export default settingService;