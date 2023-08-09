// Import React and Component
import React, { useState, useEffect } from "react";
import {
    ScrollView
} from "react-native";

// Spinner
import Spinner from "./Spinner";

import { useIsFocused } from "@react-navigation/native";

import SearchBar from "./SearchBar";

import Fuse from 'fuse.js';

import ArrayList from "../lib/ArrayList";

import ListUI from "./ListUI";

import TagService from "../services/TagService";

const TypeSelector = ({ onPress, typeName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [typeList, setTypeList] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);
    const [search, setSearch] = useState(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        getTypeList(true);
    }, [isFocused]);

    const getTypeList = (initalLoad) => {

        if (initalLoad) {
            setIsLoading(true);
        }

        TagService.search({ type: typeName }, (error, response) => {

            let tagList = response?.data?.data;

            setTypeList(tagList);

            if (initalLoad) {
                setIsLoading(false);
            }
        });
    }

    const handleChange = async (search) => {

        if (search) {

            let typeListData = new Array();

            const fuseOptions = {
                keys: ['name'], // Properties to search in each object
            };

            const fuse = new Fuse(typeList, fuseOptions);

            let results = fuse.search(search);

            if (ArrayList.isNotEmpty(results)) {
                for (let i = 0; i < results.length; i++) {
                    typeListData.push({
                        id: results[i].item.id,
                        IpAddress: results[i].item.IpAddress,
                        name: results[i].item.name,
                    })
                }
            }

            setTypeList(typeListData)
        } else {
            getTypeList(false);
        }

    }

    if (isLoading) {
        return <Spinner />;
    }
    return (
        <ScrollView>

            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                setClicked={setClicked}
                clicked={clicked}
                setSearch={setSearch}
                onPress={getTypeList}
                handleChange={handleChange}
                noScanner
            />

            <ListUI List={typeList} selectProperty={"name"} onPress={onPress} />

        </ScrollView>
    );
};

export default TypeSelector;
