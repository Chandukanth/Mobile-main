import React from "react";
import Select from "./Select";

const DateFilter = ({ handleDateFilterChange, control, data }) => {
    const options = [
        {
            label: "Today's",
            value: Filter.TODAY_VALUE
        },
        {
            label: "All",
            value: Filter.ALL_VALUE
        }
    ]

    return (
        <Select
            options={options}
            OnSelect={handleDateFilterChange}
            control={control}
            data={data}
            disableSearch
        />
    )

}
export default DateFilter


export const Filter = {
    TODAY : "today",
    TODAY_VALUE : 1,
    ALL : "all",
    ALL_VALUE : 2
}


