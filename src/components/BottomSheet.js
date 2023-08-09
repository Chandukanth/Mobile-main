// Import React and Component
import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
//cross icon
import cross from "../assets/cross.png";

export const BottomSheet = (props) => {
  const { sheetRef, Content, toggle } = props;
  return (
    <>
      <RBSheet
        ref={sheetRef}
        closeOnDragDown={true}
        height={900}
        openDuration={250}
        closeOnPressMask={false}
        customStyles={{
          container: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "transparent",
          },
        }}
      >
        {/* Bottom Sheet Design */}
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {/* cross button */}
            <TouchableOpacity onPress={toggle}>
              <View style={styles.crossButton}>
                <Image style={{ width: 30, height: 30 }} source={cross} />
              </View>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.sheetContainer}>
              <ScrollView style={{ height: "100%" }}>
                <Content />
                <View style={{ height: 45, width: "100%" }}></View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  crossButton: {
    backgroundColor: "black",
    width: 50,
    height: 50,
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 15,
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 50,
    // height: "100%",
    flexGrow: 2,
    width: "100%",
  },
});
