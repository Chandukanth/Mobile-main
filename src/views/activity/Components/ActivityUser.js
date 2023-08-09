// Import React and Component
import React from "react";

import { useNavigation } from "@react-navigation/native";

import Layout from "../../../components/Layout";


import OrderService from "../../../services/OrderService";
import UserSelectList from "../../../components/UserSelectList";

const ActivityUser = (props) => {


  const navigation = useNavigation();

  const updateUser = (user) => {
    navigation.navigate("ActivityForm",{user_id : user?.value, userName : user?.label})
  }

  return (
    <Layout
      title="Activity - Select User"
      showBackIcon
    >
      <UserSelectList onPress={updateUser} />
    </Layout>
  );
};

export default ActivityUser;
