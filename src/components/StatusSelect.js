import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import userService from "../services/UserService";
import User from "../helper/User";
import StatusService from "../services/StatusServices";
import asyncStorageService from "../services/AsyncStorageService";


const StatusSelect = (props) => {
    const { data, onChange, required, placeholder, divider, showBorder,name,disable, control, currentStatusId, projectId } = props
    const [userList, setUserList] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
        getStatusList();
    }, [isFocused]);

    const getStatusList = async () => {
        const roleId = await asyncStorageService.getRoleId()
        let status = [];

        let response = await StatusService.getNextStatus(currentStatusId,projectId, (currentStatus) => {
            status.push({
                label: currentStatus[0].name,
                value: currentStatus[0].status_id,
                id: currentStatus[0].status_id
            })
        });
        response && response.forEach((statusList) => {
            if (statusList.allowed_role_id && statusList.allowed_role_id.split(",").includes(roleId)) {
                status.push({
                    label: statusList.name,
                    value: statusList.status_id,
                    id: statusList.status_id
                });
            }
        });
        setUserList(status);

    };


    return (
        <Select
            control={control}
            options={userList}
            getDetails={(values) => onChange && onChange(values)}
            label={"Status"}
            placeholder={placeholder}
            showBorder={showBorder}
            name={name}
            data={data}
            divider={divider}
            disable={disable}
            required={required}
        />
    )
};
export default StatusSelect;
