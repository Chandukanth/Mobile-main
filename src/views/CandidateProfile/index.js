// Import React and Component
import React, { useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Layout from "../../components/Layout";
import { useIsFocused } from "@react-navigation/native";
import Refresh from "../../components/Refresh";
import ShowMore from "../../components/ShowMore";
import CandidateProfileService from "../../services/CandidateProfileService";
import CandidateCard from "./CandidateCard";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";



const CandidateProfile = (props) => {
    const [candidateList, setCandidateList] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [permission, setPermission] = useState("")
    const [refreshing, setRefreshing] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    //setting tha initial page
    const [page, setPage] = useState(2);
    //we need to know if there is more data
    const [HasMore, setHasMore] = useState(true);
    const isFocused = useIsFocused();

    const navigation = useNavigation();

    useEffect(() => {
        let mount = true;
        mount && getCandidateList()
        mount && getPermission()
        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused, refreshing]);

    const getCandidateList = async () => {
        try {
            setSearchPhrase("");
            setClicked(false);
            Keyboard.dismiss();
            setPage(2);
            setHasMore("0");
            searchPhrase == "" && !refreshing && setIsLoading(true);

            let params = { page: 1 };

            CandidateProfileService.search(params, (response) => {
                let candidate = response?.data?.data;
                setIsLoading(false);

                // Set response in state
                setCandidateList(candidate);
                setSearchPhrase(false)
            })
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const AddNew = () => {
        navigation.navigate("CandidateProfile/Form");
    };

    const getPermission = async () => {
        let add =await PermissionService.hasPermission(Permission.CANDIDATE_PROFILE_ADD)
        setPermission(add)
    }


    return (
        <Layout
            title={"Candidate Profile"}
            buttonLabel={permission ? "New" : ""}
            buttonOnPress={AddNew}
            isLoading={isLoading}
            refreshing={refreshing}
            bottomToolBar={true}
        >
            <Refresh refreshing={refreshing} setRefreshing={setRefreshing}>
                <View style={styles.container}>
                    <CandidateCard
                        candidateList={candidateList}
                    />
                    <ShowMore List={candidateList} isFetching={isFetching} HasMore={HasMore}  />

                </View>
            </Refresh>
        </Layout>
    );
};

export default CandidateProfile;

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
 
});
