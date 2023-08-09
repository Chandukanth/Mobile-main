import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import userService from "../services/UserService";
import User from "../helper/User";
import shiftService from "../services/ShiftService";


const ShiftSelect  = (props) => {
    const { data, label, onChange, required, placeholder,divider,disable,showBorder, name,control } = props
    const [shiftList, setShiftList] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        getShiftList();
    }, [isFocused]);


    const getShiftList = () => {
        let shiftListOption = new Array();

        shiftService.getShiftList({showAllowedShift : true}, (error, response) => {
            let shiftList = response?.data?.data;
            if (shiftList && shiftList.length > 0) {
                for (let i = 0; i < shiftList.length; i++) {
                    shiftListOption.push({
                        label: shiftList[i].name,
                        value: shiftList[i].id,
                    });
                }
                setShiftList(shiftListOption);
            }
        })
    }

    return (
        <Select
            control={control}
            options={shiftList}
            getDetails={(values) => onChange(values)}
            label={label}
            name={name}
            showBorder={showBorder}
            placeholder={placeholder}
            divider={divider}
            data={data}
            required={required}
            disable={disable}
        />
    )
};
export default ShiftSelect ;
