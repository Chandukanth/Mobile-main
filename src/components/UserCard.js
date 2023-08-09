import React from "react";
import UserAvatar from "react-native-user-avatar";
import { Color } from "../helper/Color";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getFullName } from "../lib/Format";

const UserCard = (props) => {
  const {
    image,
    size,
    firstName,
    lastName,
    mobileNumber,
    email,
    username,
    style,
    onPress
  } = props;
  let fullName = getFullName(firstName, lastName);

  const show = props.showFullName !== undefined ? props.showFullName : true;

  return (
    <TouchableOpacity  onPress={onPress} >
    <View style={style ? style : styles.row}>
      <View>
        <UserAvatar
          size={size ? size : 20}
          name={fullName}
          src={image}
          bgColor={Color.PRIMARY}
        />
      </View>
      <View style={styles.infoContainer}>
        {show && <Text style={styles.nameText}>{fullName}</Text>}
        {email && <Text style={styles.infoText}>{email}</Text>}
        {mobileNumber && <Text style={styles.infoText}>{mobileNumber}</Text>}
        {username && <Text style={styles.infoText}>{username}</Text>}
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  infoContainer: {
    marginLeft: 7
  },
  nameText: {
    fontWeight: "bold",
    marginBottom: 2
  },
  infoText: {
    marginBottom: 3
  }
});
