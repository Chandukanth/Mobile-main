import React from 'react';
import { View, Button } from "react-native";
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';

const FooterButtons = (props) => {
    const { onPressUpdate, onPressCancel, errors } = props
    const show = props.show !== undefined ? props.show : true;
    if (!show) {
        return null; 
    }

    return (
        <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 0.5, justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ width: "100%", }}>
                    <CancelButton onPress={onPressCancel} />
                </View>
            </View>


            <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
                <View style={{ width: "100%", }}>
                    <SaveButton errors={errors} onPress={onPressUpdate} />
                </View>
            </View>

        </View>
    )
}

export default FooterButtons