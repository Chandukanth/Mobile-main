import React from 'react';
import { Color } from '../helper/Color';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { View } from 'react-native';

const ToolBarItem =(props)=>{
    const {icon,selected,label,onPress} = props 

    return(
           <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
                    <View style={{ alignItems: "center" }}>
                        <FontAwesome5
                            name={icon}
                             size={24}
                            color={selected ? Color.BLUE : Color.TOOL_BAR}
                        />
                        <Text style={style.iconName}>{label}</Text>
                    </View>
                </TouchableOpacity>
    )
}
export default ToolBarItem;
const style = StyleSheet.create({
    iconName: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Color.ICONS_GREY
    },
});

