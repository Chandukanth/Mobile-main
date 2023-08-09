// Import React and Component
import React, { useRef } from "react";
import { StyleSheet, View, StatusBar, Animated } from "react-native";
import Header from "./Header";
// import { Body } from "./body";

const { diffClamp } = Animated;
const headerHeight = 150;

export const CollapsibleStickyHeader = (props) => {
  const { header, subHeader, body } = props;
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight * 0.6],
  });

  const translateYNumber = useRef();

  translateY.addListener(({ value }) => {
    translateYNumber.current = value;
  });

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY.current },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  return (
    <>
      <View style={{ height: "100%", width: "100%" }}>
        <StatusBar backgroundColor="black" />
        <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
          {/* HEADER AND SUBHEADER  */}
          <Header
            headerHeight={headerHeight}
            header={header}
            subHeader={subHeader}
          />
        </Animated.View>

        <Animated.ScrollView onScroll={handleScroll}>
          <View style={{ marginTop: 150, backgroundColor: "white" }}>
            {/* BODY  */}
            {body}
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#fff",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
  subHeader: {
    height: headerHeight / 2,
    width: "100%",
    paddingHorizontal: 10,
  },
});
