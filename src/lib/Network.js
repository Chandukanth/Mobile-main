import NetInfo from "@react-native-community/netinfo";

module.exports = {
	isConnected :() => {
		return NetInfo.fetch();
	}
};
