import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function () {
	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color="#596880" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
});
