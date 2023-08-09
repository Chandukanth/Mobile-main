import React from "react";
import Media from "../../../components/MediaList";
import {
    View,
   
} from "react-native";
import Layout from "../../../components/Layout";
import ObjectName from "../../../helper/ObjectName";
import { useNavigation} from "@react-navigation/native";
import DoneButton from "../../../components/DoneButton";

const PurchaseMedia = (props) => {
    const navigation = useNavigation();
    const params = props?.route?.params;
    return (
        <Layout
            title="Add Attachment"
            showBackIcon={true}
            backButtonNavigationUrl={"Purchase"}
            FooterContent={<DoneButton
                onPress={() => {
                    navigation.navigate("Purchase");
                }}
            />}
        >  
        <View>
           <Media
                Object={ObjectName.PURCHASE}
                id={params?.id}
            />
            </View>
        </Layout>
    )
}
export default PurchaseMedia