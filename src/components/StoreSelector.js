// Import React and Component
import React, { useState, useEffect } from "react";
import {
  ScrollView
} from "react-native";

// Spinner
import Spinner from "./Spinner";

import StoreService from "../services/StoreService";

import { useIsFocused } from "@react-navigation/native";

import SearchBar from "./SearchBar";

import Fuse from 'fuse.js';

import ArrayList from "../lib/ArrayList";

import ListUI from "./ListUI";

const StoreList = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    getStoreList(true);
  }, [isFocused]);

  const getStoreList = (initalLoad) => {
   
    if (initalLoad) {
      setIsLoading(true);
    }

    StoreService.list((error, response) => {

      let storeList = response?.data?.data;

      setStoreList(storeList);

      if (initalLoad) {
        setIsLoading(false);
      }
    });
  }

  const handleChange = async (search) => {

    if (search) {

      let storeListData = new Array();

      const fuseOptions = {
        keys: ['name', "IpAddress"], // Properties to search in each object
      };

      const fuse = new Fuse(storeList, fuseOptions);

      let results = fuse.search(search);

      if (ArrayList.isNotEmpty(results)) {
        for (let i = 0; i < results.length; i++) {
          storeListData.push({
            id:  results[i].item.id,
            IpAddress: results[i].item.IpAddress,
            name: results[i].item.name,
          })
        }
      }

      setStoreList(storeListData)
    } else {
      getStoreList(false);
    }

  }

  if (isLoading) {
    return <Spinner />;
  }
  return (
<>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        setClicked={setClicked}
        clicked={clicked}
        setSearch={setSearch}
        onPress={getStoreList}
        handleChange={handleChange}
        noScanner
      />
      <ScrollView>

      <ListUI List={storeList} selectProperty={"name"} onPress={props.onPress}/>

    </ScrollView>
    </>
  );
};

export default StoreList;
