import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UserCard from "../../../components/UserCard";
import transferTypeService from "../../../services/TransferTypeService";
import Status from "../../../components/Status";
import IdText from "../../../components/IdText";
import DateText from "../../../components/DateText";



const TransferCard = (props) => {
  const [TransferTypeList, setTransferTypeList] = useState();

  const {
    fromLocationName,
    toLocationName,
    status,
    statusColor,
    date,
    item,
    transferNumber,
    onPress,
    type,
    id,
    alternative
  } = props;

  useEffect(() => {
    transferTypeService.search("", (callback) => setTransferTypeList(callback));
  }, []);

  const isTransferExist = () => {
    let isExist = item.id == id;

    return isExist ? true : false;
  };

  return (
    <TouchableOpacity
      activeOpacity={1.2}
      style={[styles.align, alternative]}
      onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text>
          <IdText id={transferNumber} />
          <DateText date={date} />
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {fromLocationName} {"--->"} {toLocationName}
        </Text>
        {type && (
          <Text>
            {item?.type}
          </Text>
        )}
        <UserCard firstName={item.owner} lastName={item.lastName} image={item.image} />
         </View>
         <Status status={status} backgroundColor={statusColor} />
      </TouchableOpacity>
  );
};

export default TransferCard;
const styles = StyleSheet.create({

align:{
  alignItems: "flex-start",
  paddingBottom: 10,
  paddingTop: 10,
},
})