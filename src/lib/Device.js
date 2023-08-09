import NetInfo from '@react-native-community/netinfo';

import Constants from 'expo-constants';

import { Platform,NativeModules} from "react-native";

import * as Battery from 'expo-battery';

const {DeviceInfoModule}=NativeModules




class Device{


    async GetIpAddress(callback) {

        fetch('https://api.ipify.org?format=json')

        .then(response => response.json())

        .then(data =>callback && callback(data.ip))

        .catch(error => console.log(error));
    }

    async NetWorkStatus(callback){

        NetInfo.fetch().then(state => {

            callback && callback(state.isConnected);
          });

    }

    async GetDeviceName (callback){

        let deviceName = (Constants.deviceName)

        callback && callback(deviceName)
    }

    async GetDeviceBrandName(callback){

        let brand = Platform.constants.Brand
        
        callback && callback(brand)
    }

    async GetBatteryPercentage(callback){

        Battery.getBatteryLevelAsync().then(batteryLevel => {

            const roundedBatteryLevel = Math.round(batteryLevel * 100);

           callback && callback(roundedBatteryLevel);

          });
        
    }

    async getUniqueId(callback){
        if(DeviceInfoModule){
            let id = await DeviceInfoModule.getUniqueId()
            return callback && callback(id)
        }
        else{
            return null
        }
       
    }
}
const device = new Device;

export default device;