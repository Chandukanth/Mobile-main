import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import userService from "../services/UserService";
import User from "../helper/User";
import UserRoleService from "../services/UserRoleService";


const UserRoleSelect = (props) => {
    const { data, label, onChange, required, placeholder ,name,divider,disable,control} = props
    const [role, setRole] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
        getRole();
    }, []);

   

    const getRole = () => {
        UserRoleService.search(null,(response) => {
            setRole(response);

        })
    }

    return (
        <Select
            control={control}
            options={role}
            getDetails={(values) =>onChange && onChange(values)}
            label={label}
            name={name}
            placeholder={placeholder}
            showBorder
            data={data}
            divider={divider}
            disable={disable}
            required={required}
        />
    )
};
export default UserRoleSelect;
