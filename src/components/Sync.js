// Import React and Component
import React, { useState, useEffect } from "react";

import { Button, StyleSheet, Text } from "react-native";

import { Color } from "../helper/Color";

import Layout from "./Layout";

import productService from "../services/ProductService";

import asyncStorageService from "../services/AsyncStorageService";

import DateTime from "../lib/DateTime";

import StatusService from "../services/StatusServices";

import SyncService from "../services/SyncService";


const Sync = () => {

    const [syncing, setSyncing] = useState()
    const [LastSynced, setLastSynced] = useState()
    const [productCount, setProductCount] = useState(0)

    useEffect(() => {
        sync()
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getLastSynced();
            getProductsCount();
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const getLastSynced = async () => {
        let LastSynced = await asyncStorageService.getLastSynced()
        setLastSynced(LastSynced)

    }
    const getProductsCount = async () => {
        productService.getProductsFromLocalDB(callback => {
            setProductCount(callback.length)
        })
    }

    const sync = async () => {
        setSyncing(true)
        await SyncService.Sync(() => {
            setSyncing(false)
        });
    };
    return (
        <Layout
            title="Sync"
            bottomToolBar={true}
        > 
           {syncing&&( <Text style={style.textStyle}>{syncing && 'Syncing....'}</Text>)}
            <Text style={style.dateStyle}>{!syncing && `LastSynced At: ${DateTime.currentDate(LastSynced)}`}</Text>
            <Text style={style.productCount}>{!syncing && `TotalProductsSynced : ${productCount}`}</Text>
            {!syncing && (
                <Button title={"Sync Again"} onPress={sync} disabled={syncing ? true : false} color="black" />
            )}
        </Layout>
    )
}

const style = StyleSheet.create({
    lastSync: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        paddingTop: 250
    },
    textStyle: {
        color: Color.PRIMARY,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        paddingTop: 270,
        paddingVertical: 20
    },
    dateStyle: {
        color: Color.PRIMARY,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        paddingTop: 270,
        paddingVertical: 20

    },
    productCount: {
        color: Color.PRIMARY,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 20

    },
    textContainerStyle: {
        flex: 1,
        alignItems: "flex-start",
    },
    timeStyle: {
        flex: 0.5,
        alignItems: "flex-start",
    },
    buttonContainer: {
        flex: 0.50,
        alignItems: "flex-start",
    }
});

export default Sync;
