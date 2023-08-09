import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';
import AlertModal from "../components/Alert";

class ActivityService {
    async search(setIsLoading, callback) {
        try {
            setIsLoading && setIsLoading(true)

            apiClient.get(`${endpoints().ActivityAPI}/search?sort=created_at&sortDir=DESC`, (error, res) => {
                if (res.data.data) {
                    setIsLoading && setIsLoading(false)
                    return callback(res.data.data)
                }
            })
        } catch (err) {
            setIsLoading && setIsLoading(false)
            console.log(err);
        }
    }

    async getActivityType(callback) {
        try {

            apiClient.get(`${endpoints().ActivityTypeApi}/search`, (error, response) => {
                if (response.data && response.data) {
                    return callback(null, response);
                }
            })

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }

    }

    async create(createData, callback) {

        apiClient.post(`${endpoints().ActivityAPI}`, createData, (error, response) => {
            if (response && response.data && response.data.message) {
                Toast.show(response.data.message, Toast.LONG);
            }
            return callback(null, response);

        })
    }

}
const activityService = new ActivityService()

export default activityService