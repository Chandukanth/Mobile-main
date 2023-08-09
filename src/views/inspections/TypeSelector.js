// Import React and Component
import React from "react";

import Layout from "../../components/Layout";

import TypeSelector from "../../components/TypeSelector";

const TypeSelect = (props) => {

  let params = props?.route?.params;



  const onTypeSelect = (selectedTypeId) => {
    params && params.onTypeSelect(selectedTypeId , params.params);
  }

  return (

    <Layout
      title="Select Type"
      showBackIcon
    >
      <TypeSelector onPress={onTypeSelect} typeName={params.typeName} />
    </Layout>
  );
};

export default TypeSelect;
