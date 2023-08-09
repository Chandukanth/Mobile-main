// Import React and Component
import React from "react";

import Layout from "../../components/Layout";

import StoreSelector from "../../components/StoreSelector";

import { useNavigation } from "@react-navigation/native";

const Index = () => {

    const navigation = useNavigation();

    const onStorePress = (item) => {

        navigation.navigate("StoreDetail",{
            storeId: item.id
        });
    }

    return (
        <Layout title={"Location"} bottomToolBar={true}>
            <StoreSelector onPress={onStorePress}/>
        </Layout>
    );
};

export default Index;
