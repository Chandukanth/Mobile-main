

import apiClient from "../apiClient";

import { endpoints } from "../helper/ApiEndPoint";

import asyncStorageService from "../services/AsyncStorageService";

import UserLocationService from "../services/UserLocation";

import * as Location from 'expo-location';

import Media from "../helper/Media";

import Alert from "../components/Modal/Alert";

class AttendanceService {

    static async getAttendanceList(navigation, params, callback, totalCount) {
        try {
            const queryString = [];

            let apiUrl;

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString && queryString.length > 0) {
                apiUrl = `${endpoints().attendanceAPI}/list?${queryString.join("&")}`;
            } else {
                apiUrl = `${endpoints().attendanceAPI}/list`;
            }


            apiClient
                .get(apiUrl, (error, response) => {
                    totalCount && totalCount(response.data)
                    return callback(null, response.data.data);
                })
        } catch (err) {
            return callback(err, null);

        }
    }

    static async getDashboardData(callback) {
        try {
            apiClient
                .get(`${endpoints().attendanceAPI}/dashboard`, (error, response) => {
                    return callback(null, response);
                })
        } catch (err) {
            return callback(err, null);

        }
    }

    static async AddAttendance(navigation, bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().attendanceAPI}/checkIn`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }
    static async Leave(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().attendanceAPI}`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }

    static async create(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().attendanceAPI}/checkIn`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }


    static async getAttendanceDetail(navigation, attendanceId, callback) {
        try {
            if (attendanceId) {

                apiClient.get(`${endpoints().attendanceAPI}/${attendanceId}`, (error, response) => {
                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    static async updateAttendance(navigation, attendanceId, bodyData, callback) {
        try {

            if (attendanceId && bodyData) {

                apiClient.put(`${endpoints().attendanceAPI}/${attendanceId}`, bodyData, (error, response) => {

                    return callback(null, response);

                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    static async updateCheckOut(bodyData, callback) {
        try {
            apiClient.post(`${endpoints().attendanceAPI}/checkOut`, bodyData, (error, response) => {
                return callback(null, response);

            })
        } catch (err) {
            console.log(err);
        }
    }

    static async Delete(id, callback) {
        try {
            if (id) {

                // apiClient
                apiClient.delete(`${endpoints().attendanceAPI}/delete/${id}`, (error, res) => {

                    return callback();
                })

            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }
    static async CheckOutValidation(id, callback) {
        try {
            if (id) {

                apiClient.put(`${endpoints().attendanceAPI}/checkOut/Validation/${id}`, null, (error, response) => {
                    return callback && callback(null, response);

                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async AttendanceAttachment(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.fetch(`${endpoints().attendanceAPI}/attachment`, bodyData, (error, response) => {
                    return callback && callback(null, response);
                })
            }
        } catch (err) {
            console.log(err);
        }
    }


    static UpdateUserLocation = async () => {

        let location = await Location.getCurrentPositionAsync({});

        let data = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }

        UserLocationService.create(data, (err, result) => { })
    }

    static async CheckIn(shiftId, setIsLoading, navigation, redirectionUrl, image) {

        if (image && image.canceled == false) {

            setIsLoading(true);

            const storeId = await asyncStorageService.getSelectedLocationId();

            let bodyData = {
                store: storeId,
                shiftId: shiftId,
                type: "Working Day"
            };

            AttendanceService.create(bodyData, async (error, response) => {

                if (response && response.data && response.data.attendance) {

                    AttendanceService.UpdateUserLocation();

                    let attendance = response.data.attendance;


                    AttendanceService.addAttachment(image, attendance.id, "Check In", () => { });

                    setIsLoading(false);

                    navigation && navigation.navigate(redirectionUrl);

                } else {
                    setIsLoading(false);
                }
            });
        } else {

            const onDismiss = async () => {
                const result = await Media.getImage();
                this.CheckIn(shiftId, setIsLoading, navigation, redirectionUrl, result)
            }

            Alert.Error("Image Is Required", onDismiss);

        }
    }


    static async addAttachment(picture, attendanceId, activityType, callback) {
        try {

            if (picture && picture.assets && picture.assets.length > 0 && picture.assets[0].uri) {

                const image = await fetch(picture.assets[0].uri);

                if (image) {

                    const file = await image.blob();

                    let imageUri = picture.assets[0].uri;

                    let data = new FormData();

                    let files = {
                        type: file?._data?.type,
                        size: file?._data.size,
                        uri: imageUri,
                        name: file?._data.name,
                    };

                    data.append("media_file", files);
                    data.append("name", file?._data.name);
                    data.append("media_url", imageUri);
                    data.append("media_name", file?._data.name);
                    data.append("attendanceId", attendanceId);
                    data.append("activityType", activityType);

                    AttendanceService.AttendanceAttachment(data, async (error, response) => {
                        return callback();
                    });
                } else {
                    return callback();
                }
            } else {
                return callback();
            }

        } catch (error) {
            console.log(error);
            return callback();
        }
    }


    static async checkOut(id, callback) {
        try {

            let bodyData = {
                attendanceId: id
            }

            await AttendanceService.updateCheckOut(bodyData, async (err, response) => {

                const result = await Media.getImage();

                this.addAttachment(result, id, "Check Out", () => { });

                return callback();

            });

        } catch (err) {
            console.log(err);
        }
    }
}

export default AttendanceService;