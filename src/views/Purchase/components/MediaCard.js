import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import Swiper from 'react-native-swiper';
import { Color } from "../../../helper/Color";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MediaCard = (props) => {
  const { mediaData } = props;

  return (
    <View style={styles.container}>
      <Swiper
        key={mediaData.length}
        index={10}
        showsButtons={true}
        loop={true}
        containerStyle={[styles.swiperContainer, { marginRight:10 }]}
      >
        {mediaData.map((item, index) => {
          return (
            <View key={index}>
              <Image
                source={{ uri: item.url }}
                style={[styles.image, { width: windowWidth, height: windowHeight }]}
              />
            </View>
          );
        })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    backgroundColor: Color.WHITE,
  },
  swiperContainer: {
    flex: 1,
  },
  image: {
    resizeMode: 'contain',
  },
});

export default MediaCard;
