import asyncStorageService from "./AsyncStorageService";
class PermissionService {
    static async hasPermission(permission) {
        let isExist = false;
        let permissionList = await asyncStorageService.getPermissions();
        if (permissionList) {
            permissionList = JSON.parse(permissionList);
            if (permissionList && permissionList.length > 0) {
                for (let i = 0; i < permissionList.length; i++) {
                    if (permissionList[i].role_permission == permission) {
                        isExist = true;
                    }
                }
            }
        }
        return isExist;
    }

}
export default PermissionService;