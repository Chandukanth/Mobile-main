
import { NativeModules } from 'react-native';

const { ChangeIcon, AppNameChanger } = NativeModules
class ConfigService {

    static async IconChange(iconName) {
        if (ChangeIcon) {
            ChangeIcon.changeIcon(iconName);
        } else {
            return null
        }
    }

}
export default ConfigService