import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import ProjectService from "../services/ProjectService";


const ProjectSelect = (props) => {
    const { data, label, onChange, required, placeholder ,divider,disable,control,name, showBorder} = props
    const [projectList, setProjectList] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
        getProjectList();
    }, [isFocused]);
    useEffect(() => {
        getProjectList();
    }, []);

    const getProjectList = () => {
        ProjectService.list(null,(response) => {
            setProjectList(response);

        })
    }

    return (
        <Select
            control={control}
            options={projectList}
            getDetails={(values) =>onChange && onChange(values)}
            label={label}
            placeholder={placeholder}
            data={data}
            name={name}
            divider={divider}
            disable={disable}
            showBorder={showBorder}
            required={required}
        />
    )
};
export default ProjectSelect;
