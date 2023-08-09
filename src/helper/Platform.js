import React, { Component } from "react";
import {
	Platform,
} from "react-native";

module.exports = {
	isIOS: () => {
		return (
			Platform.OS === "ios"
		);
	},

	isAndroid: () => {
		return (
			Platform.OS === "android"
		);
	}
};

