import StringLib from "../lib/String";
import MediaService from "../services/MediaService";
import * as ImagePicker from "expo-image-picker";

class Media {
    static async uploadImage(id, file, image, objectName, setIsLoading, userName, callback) {
        try {
            setIsLoading && setIsLoading(true)

            if (file) {

                const data = new FormData();
                let files = {
                    type: file?._data?.type,
                    size: file?._data.size,
                    uri: image,
                    name: file?._data.name,
                };

                let mediaName

                if (userName) {
                    mediaName = userName
                    if (mediaName) {
                        mediaName = StringLib.ReplaceSpaceDashSymbol(mediaName);
                    }
                } else {
                    mediaName = file?._data.name;
                }

                data.append("media_file", files);
                data.append("media_name", mediaName);
                data.append("object", objectName);
                data.append("object_id", id);
                data.append("media_url", image);
                data.append("media_visibility", 2);
                data.append("feature", 1);
                await MediaService.uploadMedia(null, data, async (error, response) => {

                    setIsLoading && setIsLoading(false)
                    return callback(response);
                });
            }
        }
        catch (err) {
            setIsLoading && setIsLoading(false)
        }

    }

    static async getImage() {
        try {
            let permission = await ImagePicker.requestCameraPermissionsAsync();

            let mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permission && permission.status == 'granted' && mediaPermission && mediaPermission.status == 'granted') {
                const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 1,
                });
                return result;
            }
            return null;
        } catch (err) {
            console.log(err);
        }

    }

}
export default Media;