// Import React and Component
import React from "react";

import { useNavigation } from "@react-navigation/native";

import Layout from "../../../components/Layout";


import OrderService from "../../../services/OrderService";
import UserSelectList from "../../../components/UserSelectList";

const UserSelector = (props) => {

  let params = props?.route?.params;

  const navigation = useNavigation();

  const updateUser = (user) => {
    let UserID = user?.value;
    let data = { sales_executive_user_id: UserID };
    OrderService.updateOrder(params.id, data, (error, response) => {
      navigation.navigate("Order/ProductList", {
        id: params.id,
        storeId: params.storeId,
        locationName: params?.locationName,
        shift: params?.shift,
        salesExecutive : user?.label,
        date:params?.date
      })
    });
  }

  return (
    <Layout
      title="Order - Select SalesExecutive"
      showBackIcon
    >
      <UserSelectList onPress={updateUser} />
    </Layout>
  );
};

export default UserSelector;
