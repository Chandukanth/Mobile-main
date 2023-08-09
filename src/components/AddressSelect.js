import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import addressServices from "../services/AddressService";
import Select from "./Select";



const AddressSelect = (props) => {
    const { data, label, onChange, required, placeholder,showBorder, disable, control,name } = props
    const [addressList, setAddressList] = useState();
    const isFocused = useIsFocused();


    useEffect(() => {
        let mount = true;

        mount && addressServices.search({}, callback => { setAddressList(callback); })

        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused])


    return (
        <Select
            label={label}
            options={addressList}
            control={control}
            data={data}
            OnSelect={onChange}
            showBorder={showBorder}
            divider
            name ={name}
            placeholder={placeholder}
            disable={disable}
            required={required}

        />
    )
};
export default AddressSelect;