import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Select from '../components/Select';
import PaymentAccountService from "../services/PaymentAccountService";


const PaymentAccountSelect = (props) => {
    const { data, label, onChange, required, placeholder, divider, control, name} = props
    const [paymentAccountList, setPaymentAccountList] = useState([]);


    useEffect(() => {
        getPaymentAccount();
    }, []);



    const getPaymentAccount = async () => {
        await PaymentAccountService.search(setPaymentAccountList)
    }

    return (
        <Select
            control={control}
            options={paymentAccountList}
            getDetails={(values) => onChange && onChange(values)}
            label={label}
            placeholder={placeholder}
            showBorder
            data={data}
            name={name}
            divider={divider}
            required={required}
        />
    )
};
export default PaymentAccountSelect;
