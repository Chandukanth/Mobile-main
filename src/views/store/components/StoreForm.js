
//React
import React from "react";

import { View, ScrollView } from "react-native";

//Components

import { useForm } from "react-hook-form";

import TextInput from "../../../components/TextInput";

const StoreForm = ({ storeDetail }) => {


    let preloadedValues = {
        defaultValues: {
            locationName: storeDetail?.name,
            status: storeDetail?.status,
            ipAddress: storeDetail?.ip_address,
            minimumCashInStore: storeDetail?.minimum_cash_in_store
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm(preloadedValues);

    return (
        <ScrollView>
            <View style={{ marginTop: 10, padding: 10 }}>
                <TextInput
                    title="Name"
                    name="locationName"
                    placeholder="Location Name"
                    control={control}
                />

                <TextInput
                    title="Status"
                    name="status"
                    placeholder="Status"
                    control={control}
                />

                <TextInput
                    title="Ip Address"
                    name="ipAddress"
                    placeholder="Ip Address"
                    control={control}
                />

                <TextInput
                    title="Minimum Cash In Store"
                    name="minimumCashInStore"
                    placeholder="Minimum Cash In Store"
                    control={control}
                />
            </View>
        </ScrollView>
    );
};

export default StoreForm;
