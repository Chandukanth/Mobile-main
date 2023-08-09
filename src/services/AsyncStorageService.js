import AsyncStorageConstants from "../helper/AsyncStorage";
import AsyncStorage from "../lib/AsyncStorage";
class AsyncStorageService {
    async getUserId() {
        let UserId = await AsyncStorage.getItem(
            AsyncStorageConstants.USER_ID
        );
        return UserId
    }
    async getUserName() {
        let UserName = await AsyncStorage.getItem(
            AsyncStorageConstants.USER_NAME
        );
        return UserName
    }
    async getPermissions() {
        let Permissions = await AsyncStorage.getItem(
            AsyncStorageConstants.PERMISSIONS
        );
        return Permissions
    }
    async getStatusList() {
        let Permissions = await AsyncStorage.getItem(
            AsyncStorageConstants.STATUS_LIST
        );
        return Permissions
    }
    async getSessionToken() {
        let sessionToken = await AsyncStorage.getItem(
            AsyncStorageConstants.SESSION_TOKEN
        );
        return sessionToken
    }
    async getSelectedLocationId() {
        let storeId = await AsyncStorage.getItem(
            AsyncStorageConstants.SELECTED_LOCATION_ID
        );

        return storeId
    }
    async getSelectedLocationName() {
        let storeId = await AsyncStorage.getItem(
            AsyncStorageConstants.SELECTED_LOCATION_NAME
        );
        return storeId
    }
    async getRoleId() {
        let roleId = await AsyncStorage.getItem(
            AsyncStorageConstants.ROLE_ID
        );
        return roleId
    }
    async getLastSynced() {
        let LastSynced = await AsyncStorage.getItem(
            AsyncStorageConstants.LAST_SYNCED
        );
        return LastSynced
    }
    async setUserId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.USER_ID, data);

    }
    async setUserName(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.USER_NAME, data);

    }
    async setPermissions(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.PERMISSIONS, data);

    }
    async setStatusList(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.STATUS_LIST, data);

    }
    async setSessionToken(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SESSION_TOKEN, data);

    }
    async setSelectedLocationId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SELECTED_LOCATION_ID, data);

    }
    async setSelectedLocationName(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.SELECTED_LOCATION_NAME, data);

    }
    async setRoleId(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.ROLE_ID, data);
    }
    async setLastSync(data) {
        await AsyncStorage.setItem(
            AsyncStorageConstants.LAST_SYNCED, data);
    }


}
const asyncStorageService = new AsyncStorageService();
export default asyncStorageService