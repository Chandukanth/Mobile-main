import React from "react";
import { Button, View } from "react-native";
import { Color } from "../helper/Color";

const SyncButton = ({ syncing, onPress, title }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop:10 }}>
      <Button
        title={syncing ? 'Syncing' : title}
        onPress={onPress}
        disabled={syncing}
        color={Color.BLACK}
      />
    </View>
  );
};

export default SyncButton;
