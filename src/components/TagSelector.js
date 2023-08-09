import React, { useState, useEffect } from "react";
import Select from '../components/Select'
import { useIsFocused } from "@react-navigation/native";
import tagService from "../services/TagService";


const TagSelector = (props) => {
    const { data, label, onChange, required, placeholder, type,name, control, disable } = props
    const [tagList, setTagList] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
        getTagList();
    }, [isFocused]);

    const getTagList = () => {
        tagService.list({ type: type }, (err, response) => {
            let list = response.data.data
            let tagList = []

            if(list && list.length > 0) {
                for(let i=0; i<list.length; i++) {
                tagList.push({
                    label : list[i].name,
                    value:list[i].id,
                    id:list[i].id
                })
            }
            }
            setTagList(tagList)
        })
    }

    return (
        <Select
            control={control}
            options={tagList}
            getDetails={(values) => onChange && onChange(values)}
            label={label}
            name={name}
            placeholder={placeholder}
            data={data}
            required={required}
            disable={disable}
        />
    )
};
export default TagSelector;
