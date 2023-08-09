import React from "react";
import { Text, View } from "react-native";
import { Color } from "../../helper/Color";
import VerticalSpace10 from "../../components/VerticleSpace10";

const HeaderCard = ({ name, locationName }) => {

    return (
        <>
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Text style={{ color: Color.RED, fontSize: 20, fontWeight: 'bold' }}>Hello !&nbsp;
                    <Text style={{ color: Color.INDIGO, fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
                </Text>
            </View>
            <VerticalSpace10 />

            <View style={{ }}>
                <Text style={{ color: Color.RED, fontSize: 15, fontWeight: 'bold' }}>Your Location:
                    <Text style={{ color: Color.INDIGO, fontSize: 15, fontWeight: 'bold' }}> {locationName}</Text>
                </Text>
            </View>
        </>
    )

}
export default HeaderCard;