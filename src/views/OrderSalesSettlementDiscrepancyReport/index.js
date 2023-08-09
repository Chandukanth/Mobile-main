import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Refresh from "../../components/Refresh";
import { View } from "react-native";
import NoRecordFound from "../../components/NoRecordFound";
import ShowMore from "../../components/ShowMore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import OrderSalesSettlementDiscrepancyCard from "./Components/OrderSalesSettlementDiscrepancyCard";
import OrderSalesSettlementDiscrepancyReportService from "../../services/OrderSalesSettlementDiscrepancyReport";
import AlternativeColor from "../../components/AlternativeBackground";
import { useForm } from "react-hook-form";
import DatePicker from "../../components/DatePicker";

const OrderSalesSettlementDiscrepancyReport = () => {
  const [discrepancy, setDiscrepancy] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const isFocused = useIsFocused();
  const [page, setPage] = useState(2);
  const [HasMore, setHasMore] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigation = useNavigation();

  const {
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getList(selectedDate);
  }, [isFocused, refreshing, navigation]);

  const getList = async (value) => {
    setPage(2);
    setHasMore("0");
    setIsLoading(true);
    setSelectedDate(new Date(value));

    let params = new Object();

    params.startDate = new Date(value);
    params.endDate = new Date(value);

    await OrderSalesSettlementDiscrepancyReportService.search(
      params,
      (response) => {
        if (response && response.data && response.data.data) {
          setDiscrepancy(response.data.data);
        }
        setIsLoading(false);
      }
    );
  };

  const LoadMoreList = async () => {
    try {
      setIsFetching(true);

      let params = new Object();

      params.page = page;

      params.startDate = selectedDate;
      params.endDate = selectedDate;

      OrderSalesSettlementDiscrepancyReportService.search(
        params,
        (response) => {
          if (response && response.data && response.data.data) {
            let discrepancy = response.data.data;

            // Set response in state
            setDiscrepancy((prevTitles) => {
              return [...new Set([...prevTitles, ...discrepancy])];
            });
            setPage((prevPageNumber) => prevPageNumber + 1);
            setHasMore(discrepancy.length > 0);
            setIsFetching(false);
          }
        }
      );
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  return (
    <Layout
      title="Order and SalesSettlement Discrepancy Report"
      isLoading={isLoading}
      refreshing={refreshing}
      bottomToolBar={true}
      filter={<DatePicker onDateSelect={getList} selectedDate={selectedDate} />}
    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
        <View>
          <View>
            {discrepancy && discrepancy.length > 0 ? (
              discrepancy.map((item, index) => {
                const containerStyle =
                  AlternativeColor.getBackgroundColor(index);
                return (
                  <OrderSalesSettlementDiscrepancyCard
                    date={item.date}
                    firstName={item.name}
                    lastName={item.last_name}
                    item={item}
                    location={item.location}
                    shift={item.shift}
                    totalOrderCash={item.totalOrderCash}
                    totalOrderUpi={item.totalOrderUpi}
                    totalSaleUpi={item.totalSaleUpi}
                    totalSaleCash={item.totalSaleCash}
                    total_discrepancy_upi={item.total_discrepancy_upi}
                    total_discrepancy_cash={item.total_discrepancy_cash}
                    total_draft_order_amount={item.totalDraftOrderAmount}
                    alternative={containerStyle}
                  />
                );
              })
            ) : (
              <NoRecordFound iconName="receipt" />
            )}

            <ShowMore
              List={discrepancy}
              isFetching={isFetching}
              HasMore={HasMore}
              onPress={LoadMoreList}
            />
          </View>
        </View>
      </Refresh>
    </Layout>
  );
};

export default OrderSalesSettlementDiscrepancyReport;
