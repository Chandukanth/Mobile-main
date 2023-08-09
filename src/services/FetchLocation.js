import * as Location from "expo-location";

export const fetchLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("permission not granted");
    return { message: "permission not granted" };
  }
  let location = await Location.getCurrentPositionAsync({});
  return location;
};
