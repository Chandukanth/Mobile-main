// Import React and Component
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { Color } from "../../helper/Color";
import SaleSettlementCard from "./components/SaleSettlementCard";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import SaleSettlementService from "../../services/SaleSettlementService";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import Refresh from "../../components/Refresh";
import DateFilter, { Filter } from "../../components/DateFilter";
import { useForm } from "react-hook-form";
import DateTime from "../../lib/DateTime";


const Sale = (props) => {
  let params = props?.route?.params

  const [salesList, setSalesList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(Filter.TODAY_VALUE)
  const [filter, SetFilter] = useState(params?.filter ? params?.filter : Filter.TODAY)
 
  const [isFetching, setIsFetching] = useState(false);
  //setting tha initial page
  const [page, setPage] = useState(2);
  //we need to know if there is more data
  const [HasMore, setHasMore] = useState(true);
  const isFocused = useIsFocused();
  const [permission, setPermission] = useState("")

  const navigation = useNavigation();




  const addPermission = async () => {
    const addPermission = await PermissionService.hasPermission(Permission.SALE_SETTLEMENT_ADD);
    setPermission(addPermission);
  }


  // render the stock entry list function
  useEffect(() => {
    if (isFocused) {
      let mount = true;
      mount && addPermission()

      if (params?.filter === Filter.ALL || selectedFilter === Filter.ALL_VALUE) {
        getAllList();
      } else {
        getTodayList();
      }
      //cleanup function
      return () => {
        mount = false;
      };
    }
  }, [isFocused, refreshing]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
  });

  //Get Product List
  const getAllList = async () => {
    setIsLoading(true);
    try {
      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");
      const startDate = DateTime.CurrentStartMonth()
      const endDate = DateTime.CurrentEndMonth()
      let param = { startDate: startDate, endDate: endDate}
      SaleSettlementService.search(param, (error, response) => {
        let sales = response?.data?.data;

        // Set response in state
        setSalesList(sales);
        setIsLoading(false);
        SetFilter(Filter.ALL)

      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const getTodayList = async () => {
    setIsLoading(true);

    try {

      Keyboard.dismiss();
      setPage(2);
      setHasMore("0");

      let params = { startDate: DateTime.formatDate(new Date()), endDate: DateTime.toISOEndTimeAndDate(new Date()) };

      SaleSettlementService.search(params, (error, response) => {
        let sales = response?.data?.data;

        // Set response in state
        setSalesList(sales);
        setIsLoading(false);
        SetFilter(Filter.TODAY)


      })
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const handleDateFilterChange = (values) => {
    setSelectedFilter(values)
    if (values === Filter.TODAY_VALUE) {
      getTodayList()
    } else {
      getAllList()
    }

  }

  const AddNew = () => {
    navigation.navigate("SalesSettlementForm");
  };

  const handleChange = async (search) => {
    let params = { page: 1, search: search }

    SaleSettlementService.search(params, (error, response) => {
      let sales = response?.data?.data;
      // Set response in state
      setSalesList(sales);
      setIsLoading(false);

      if (searchPhrase.length == 0) {
        getSaleList();
      }
    })
  };

  const LoadMoreList = async () => {
    try {
      let params
      setIsFetching(true);
      if (filter === Filter.TODAY) {
        params = { page: page, startDate: DateTime.formatDate(new Date()), endDate: DateTime.toISOEndTimeAndDate(new Date()) };
      } else {
        const startDate = DateTime.CurrentStartMonth()
        const endDate = DateTime.CurrentEndMonth()
        params = { startDate: startDate, endDate: endDate, page: page }

      }

      SaleSettlementService.search(params, (error, response) => {

        let sales = response?.data?.data;

        // Set response in state
        setSalesList((prevTitles) => {
          return [...new Set([...prevTitles, ...sales])];
        });
        setPage((prevPageNumber) => prevPageNumber + 1);
        setHasMore(sales.length > 0);
        setIsFetching(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };


  return (
    <Layout
      title={"Sales Settlement"}
      buttonLabel={permission ? "New" : ""}
      buttonOnPress={AddNew}
      isLoading={isLoading}
      refreshing={refreshing}
      bottomToolBar={true}
      filter={
        <DateFilter
          handleDateFilterChange={handleDateFilterChange}
          control={control}
          data={selectedFilter}
        />}

    >
      <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>

        <View style={styles.container}>
          <View>
            {salesList && salesList.length > 0 ? (
              salesList.map((item, index) => {
                const containerStyle = AlternativeColor.getBackgroundColor(index)

                return (
                  <SaleSettlementCard
                    saleSettlementNumber={item.saleSettlementNumber}
                    date={item.date}
                    locationName={item.locationName}
                    salesExecutive={item.salesExecutive}
                    status={item.status}
                    total_amount={item.total_amount}
                    shift={item.shift}
                    alternative={containerStyle}
                    onPress={() => {
                      navigation.navigate("SalesSettlement/Detail", { item });
                    }}
                  />
                );
              })
            ) : (
              <View style={{ paddingVertical: 250, alignItems: "center" }}>
                <FontAwesome5 name="receipt" size={20} color={Color.PRIMARY} />
                <Text style={{ fontWeight: "bold" }}>No Records Found</Text>
              </View>
            )}
            <ShowMore List={salesList} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
          </View>
        </View>
      </Refresh>
    </Layout>
  );
};

export default Sale;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 0.2,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  headerStyle: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "#E8E8E8",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addStocks: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  addButton: {
    height: 10,
  },
  card: {
    height: 60,
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 5,
  },
  cartText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
