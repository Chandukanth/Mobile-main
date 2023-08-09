import React from "react";
import { Image } from "react-native";

const ImageCard = (props) => {
    const {ImageUrl} = props
  return (
    <Image source={{ uri:  ImageUrl }} style={{ width: 50, height: 50 }} />
  );
};
export default ImageCard;
