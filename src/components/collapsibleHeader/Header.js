import React from "react";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
// import propsT

const Header = (props) => {
  const { headerHeight, header, subHeader } = props;
  // const headerHeight = 150;
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight * 0.6,
          },
        ]}
      >
        {/* Heder  */}
        {header}
      </View>
      <View
        style={[
          styles.subHeader,
          {
            height: headerHeight * 0.4,
          },
        ]}
      >
        {/* subHeader */}
        {subHeader}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversation: { fontSize: 16, fontWeight: "bold" },
  searchText: {
    color: "#8B8B8B",
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadae8",
    borderRadius: 5,
    width: "100%",
  },
  inputStyle: {
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
    width: "90%",
    borderRadius: 5,
  },
  countBadge: {
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: "#fc5203",
    position: "absolute",
    top: -10,
    left: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
// Header.props
export default Header;
