import React from "react";
import { TouchableOpacity , Text, StyleSheet} from "react-native";
import { Color } from "../helper/Color";

const Tab = ({ title, isActive, onPress }) => {

    return (
        <TouchableOpacity
            style={[styles.tab, isActive ? styles.activeTab : null]}
            onPress={onPress}
        >
            <Text style={[styles.tabTitle, isActive ? styles.activeTabTitle : null]}>
                {title}
            </Text>
        </TouchableOpacity>
    );


}
export default Tab

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabTitle: {
        fontSize: 14,
    },
    activeTab: {
        backgroundColor: Color.BLACK,
    },
    activeTabTitle: {
        fontWeight: 'bold',
        color : 'white'
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});