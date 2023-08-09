// Import React and Component
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Layout from "../../../components/Layout";
import UserSelectList from "../../../components/UserSelectList";
import stockEntryService from "../../../services/StockEntryService";

const OwnerSelector = (props) => {

  let params = props?.route?.params;

  const navigation = useNavigation();

  const updateUser = async (user) => {
    let UserID = user?.id;
    let data = { owner: UserID };
    await stockEntryService.UpdateStockEntry(params.stockEntryId, data, (err, response)=>{
        if(response){
            navigation.navigate("StockEntry/Product", {
                stockEntryId:params?.stockEntryId,
                storeId: params?.storeId,
                locationName: params?.locationName,
                date : params?.date,
                status: params?.status,
                owner : user?.firstName
            })
        }

    }
    
    );
    
  }

  return (
    <Layout
      title="Stock - Select Owner"
      showBackIcon
    >
      <UserSelectList onPress={updateUser} />
    </Layout>
  );
};

export default OwnerSelector;
