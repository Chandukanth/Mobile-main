import React, { useEffect, useState, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from "react-native";
import Layout from "../../components/Layout";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
import ticketService from "../../services/TicketServices";
import AlternativeColor from "../../components/AlternativeBackground";
import ShowMore from "../../components/ShowMore";
import TicketCard from "./components/TicketCard";
import NoRecordFound from "../../components/NoRecordFound";
import Refresh from "../../components/Refresh";
import SearchBar from "../../components/SearchBar";

const Ticket = () => {
    const [ticket, setTicket] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(2);
    const [HasMore, setHasMore] = useState(true);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [search, setSearch] = useState(false);
    const [searchParam, setSearchParam] = useState("")





    const navigation = useNavigation();

    useEffect(() => {
        if (isFocused) {
            getTicketList();
        }

    }, [isFocused,refreshing]);

    const getTicketList = async () => {
        setSearchPhrase("");
        setClicked(false);
        Keyboard.dismiss();
        setPage(2);
        setHasMore("0");
        searchPhrase == "" && setSearch(true);
        searchPhrase == "" && !refreshing && setIsLoading(true);
        let mount = true;
        mount && await ticketService.search(setIsLoading,
            (callback) => setTicket(callback));
        setPage(2);

        return () => {

            mount = false;
        };
    }

    const handleChange = async (search) => {
        setSearchParam(search)
        //Api Call
        ticketService.searchTicket({ search: search ? search : "" }, (error, response) => {
          let tickets = response.data.data;
          setTicket(tickets);
          if (searchPhrase.length == 0) {
            getTicketList;
          }
        })
    
      };
      const LoadMoreList = async () => {
        try {
          setIsFetching(true);
    
          ///Api call
          ticketService.searchTicket({ page: page, search: searchParam ? searchParam : "" }, (error, response) => {
            let tickets = response.data.data;
            // Set response in state
            setTicket((prevTitles) => {
              return [...new Set([...prevTitles, ...tickets])];
            });
            setPage((prevPageNumber) => prevPageNumber + 1);
            setHasMore(tickets.length > 0);
            setIsFetching(false);
          })
    
        } catch (err) {
          console.log(err);
          setIsLoading(false);
        }
      };

   

    const addNew = () => {
        navigation.navigate("Ticket/Add")
    }

    return (
        <Layout
            title='Tickets'
            buttonLabel={"Add"}
            buttonOnPress={addNew}
            isLoading={isLoading}
            bottomToolBar={true}
            refreshing={refreshing}


        >
            <ScrollView

                keyboardShouldPersistTaps="handled"
            >
                <Refresh refreshing={refreshing} setRefreshing={setRefreshing} >
                    <View style={styles.containerview}>
                    <View style={styles.searchBar}>
                    <SearchBar
                       searchPhrase={searchPhrase}
                       setSearchPhrase={setSearchPhrase}
                       setClicked={setClicked}
                       clicked={clicked}
                       setSearch={setSearch}
                       onPress={getTicketList}
                       handleChange={handleChange}
                       noScanner
          />

          </View>

                        <View>
                            {ticket && ticket.length > 0 ? ticket.map((item, index) => {
                                const containerStyle = AlternativeColor.getBackgroundColor(index)
                                return (
                                    <TicketCard
                                        eta={item.eta}
                                        summary={item.summary}
                                        assignee_name={item.assignee_name}
                                        avatarUrl={item.avatarUrl}
                                        status={item.statusName}
                                        ticket_number={item.ticket_number}
                                        statusColor={item.statusColor}
                                        alternative={containerStyle}
                                        onPress={() => navigation.navigate("Ticket/Detail", { item: item })}

                                    />
                                )
                            }
                            ) : (
                                <NoRecordFound iconName="receipt" />

                            )}

                            <ShowMore List={ticket} isFetching={isFetching} HasMore={HasMore} onPress={LoadMoreList} />
                        </View>
                    </View>
                </Refresh>
               </ScrollView>

        </Layout>
    )
}
export default Ticket;
const styles = StyleSheet.create({

containerview: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 0.2,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
})

