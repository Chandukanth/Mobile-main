// Import React and Component
import React from "react";

import Layout from "../../components/Layout";

import StoreSelector from "../../components/StoreSelector";

const StoreSelectionScreen = (props) => {

  let params = props?.route?.params;


  const onSelectStore = (selectedStoreId) => {
    params && params.onSelectStore(selectedStoreId , params.params);
  }

  return (

    <Layout
      title="Select Location"
      showBackIcon
    >
      <StoreSelector onPress={onSelectStore} />
    </Layout>
  );
};

export default StoreSelectionScreen;
