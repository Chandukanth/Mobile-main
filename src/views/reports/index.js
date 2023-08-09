import React, { useState } from "react";
import { View } from "react-native";
import Layout from "../../components/Layout";
import Refresh from "../../components/Refresh";
import ReportCard from "./components/ReportCard";

const Reports = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout
      title="Order Reports"
      isLoading={isLoading}
      bottomToolBar={true}
      refreshing={refreshing}
      showBackIcon={true}>
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        <View style={{ flex: 1 }}>
          <ReportCard />
        </View>
      </Refresh>
    </Layout>
  );
};

export default Reports;
