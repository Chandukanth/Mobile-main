import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Color } from '../helper/Color';

const QuickLinksIcon = ({ iconName, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.icon}>
      <FontAwesome5 name={iconName} size={30} color={Color.INDIGO} />
      </View>
      <Text style={styles.iconName}>{label}</Text>
    </TouchableOpacity>
  );
};

export default QuickLinksIcon;
const styles = StyleSheet.create({
    icon:{
        marginLeft:12
    },
    iconName: {
        marginTop: 5,
        fontSize: 10,
        marginRight:15,
        fontWeight: 'bold',
        color: Color.RED
    },

});

