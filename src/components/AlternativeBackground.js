import React from "react";
import { StyleSheet } from "react-native";
import { Color } from "../helper/Color";
class AlternativeColor {

    static getBackgroundColor(index, plainText) {
        let Styles
        if(plainText){
            Styles = index % 2 === 0 ? styles.plainWhite : styles.plainGrey;
        }else{
            Styles = index % 2 === 0 ? styles.containerWhite : styles.containerGrey;
        }
        return Styles;
    }

    static getDeleteBackground(callback){
        let DeleteStyle=styles.actionDeleteButton
        return DeleteStyle;
    }

}
export default AlternativeColor;
const styles = StyleSheet.create({
    containerWhite: {
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
        backgroundColor: Color.WHITE
    },
    containerGrey: {
        backgroundColor: Color.ALTERNATIVE_BACKGROUND,
        alignItems: "center",
        flexDirection: "row",
        flex: 1,
    },
    plainWhite: {
        backgroundColor: Color.WHITE
    },
    plainGrey: {
        backgroundColor: Color.ALTERNATIVE_BACKGROUND,
    },
    actionDeleteButton: {
        alignItems: 'center',
        bottom: 15,
        justifyContent: 'center',
        position: 'absolute',
        top: 20,
        width: 50,
        backgroundColor: '#D11A2A',
        right: 20
    },
});
