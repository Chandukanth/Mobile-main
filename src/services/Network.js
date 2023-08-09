import NetInfo from "@react-native-community/netinfo";

import AlertModal from '../components/Alert';

class Network {

    static async isAvailable() {
        
        const response = await NetInfo.fetch();

        if (!response.isConnected) {
            AlertModal("Error", "No Internet Connection");
        }
    }
    static async NetworkInfo() {
        
        const response = await NetInfo.fetch();

        return response
    }

}

export default Network;