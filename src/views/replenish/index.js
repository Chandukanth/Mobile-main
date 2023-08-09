// Import React and Component
import React, { useState } from "react";

import { TouchableOpacity, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

//Footer and Header
import Layout from "../../components/Layout";

import { Color } from "../../helper/Color";

const Replenish = (props) => {
    //Loading
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const Link = ({ label, icon, backgroundColor, materialIcon, redirectUrl }) => {

        return (
            <>
                <View style={{ flex: 1, flexDirection: "column", alignItems: "center", }}>
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 50,
                            backgroundColor: backgroundColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity onPress={()=> navigation.navigate(redirectUrl)}>
                            {materialIcon ? (
                                <MaterialCommunityIcons name={icon} size={30} color={Color.DARK_YELLOW} />
                            ) : (
                                <FontAwesome5 name={icon} size={20} color={Color.DARK_YELLOW} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={{ marginTop: 10 }}>{label}</Text>
                </View>
            </>
        )
    }

    return (
        <Layout
            title={"Replenish"}
            isLoading={isLoading}
            bottomToolBar={true}
        >
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 40 }}>

                <Link label={"Store Replenish"} icon={"warehouse"} backgroundColor={Color.LIGHT_YELLOW} materialIcon redirectUrl={"StoreReplenish"}/>

                <Link label={"Product Replenish"} icon={"box-open"} backgroundColor={Color.LIGHT_YELLOW} redirectUrl={"ProductReplenish"} />

                <Link label={"Replenishment Products"} materialIcon icon={"transfer"} backgroundColor={Color.LIGHT_YELLOW} redirectUrl={"ReplenishmentProduct"} />

            </View>
            
        </Layout>
    );
};

export default Replenish;
