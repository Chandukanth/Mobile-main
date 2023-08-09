import React, { useRef } from "react";
import { StyleSheet, TextInput, View, Keyboard } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";

const SearchBar = ({
	handleChange,
	clicked,
	searchPhrase,
	setSearchPhrase,
	setClicked,
	onPress,
	onPressIn,
	setSearch,
	openScanner,
	noScanner,
	focus,
	onEndEditing
}) => {
	const inputRef = useRef();
	return (
		<View style={styles.container}>
			<View
				style={
					clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
				}
			>
				{/* search Icon */}
				{clicked && !searchPhrase ? (
					<Ionicons
						name="arrow-back"
						size={24}
						color="black"
						onPress={() => {
							setSearchPhrase && setSearchPhrase("");
							setClicked && setClicked(false);
							Keyboard.dismiss();
							setSearch && setSearch(false);
						}}
					/>
				) : (
					<Feather
						name="search"
						size={20}
						color="black"
						style={{ marginLeft: 1 }}
					/>
				)}

				{/* Input field */}
				<TextInput
					style={styles.input}
					ref={focus && (inputRef)}
					onLayout={focus && (() => inputRef.current.focus())}
					placeholder="Search"
					value={searchPhrase}
					onChangeText={(text) => {
						setSearchPhrase && setSearchPhrase(text);
						handleChange && handleChange(text);
					}}
					onPressIn={() => {
						setClicked && setClicked(true);
					}}
					onBlur={() => {
						Keyboard.dismiss();
					}}
					onEndEditing={(text)=> {
						onEndEditing && onEndEditing(text.target.value);
					}}
				/>

				{/* cross Icon, depending on whether the search bar is clicked or not */}
				{clicked && !searchPhrase && !noScanner && (
					<MaterialIcons
						name="qr-code-scanner"
						style={{ padding: 5 }}
						size={20}
						color="black"
						onPress={() => openScanner()}
					/>
				)}

				{searchPhrase && (
					<Entypo
						name="cross"
						size={24}
						color="black"
						onPress={() => {
							onPress && onPress();
							setSearchPhrase && setSearchPhrase("");
						}}
					/>
				)}
			</View>
		</View>
	);
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
		// marginHorizontal: 5,
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "row",
		width: "100%",
	},
	searchBar__unclicked: {
		padding: 10,
		flexDirection: "row",
		width: "100%",
		backgroundColor: "#d9dbda",
		alignItems: "center",
		backgroundColor: "#f5f7fa",
	},
	searchBar__clicked: {
		padding: 10,
		flexDirection: "row",
		width: "100%",
		backgroundColor: "#d9dbda",
		alignItems: "center",
		justifyContent: "space-evenly",
		backgroundColor: "#f5f7fa",
	},
	input: {
		fontSize: 20,
		marginLeft: 10,
		width: "85%",
	},
});
