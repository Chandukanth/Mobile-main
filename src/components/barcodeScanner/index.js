import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	Button,
	useWindowDimensions,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { useNavigation } from "@react-navigation/native";

import { verticalScale } from '../Metrics'

import DateTime from "../../lib/DateTime";

import BarCodeScanSound from "../../components/BarCodeScanSound";

const BarcodeScanner = (props) => {

	const { onScan, height, width } = props;

	const [hasPermission, setHasPermission] = useState(false);

	const navigation = useNavigation();

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setHasPermission(false);
			(async () => {
				const { status } = await BarCodeScanner.requestPermissionsAsync();
				setHasPermission(status === "granted");
			})();
		});
		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		};

		getBarCodeScannerPermissions();
	}, []);

	const handleBarCodeScanned = async ({ type, data }) => {
		BarCodeScanSound();

		onScan({ type, data });
	};

	if (hasPermission === false) {
		return <View />;
	}
	const styles = StyleSheet.create({
		container: {
			alignItems: "center",
			justifyContent: "space-between",
			borderRadius: 50,
		},
	});

	return (
		<View style={styles.container}>

			{hasPermission &&
				<BarCodeScanner
					onBarCodeScanned={handleBarCodeScanned}
					style={{ height: height ? height : verticalScale(500), width: width ? width : verticalScale(620) }}
				/>
			}
		</View>
	);
};

export default BarcodeScanner;
