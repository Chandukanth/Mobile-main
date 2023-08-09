import React, { useState, useEffect } from 'react';

import Select from "../components/Select";

const Quantity = ({control, onChange, preloadedValues, Numbers, label, name}) => {
    const [options, setOption] = useState([]);

    useEffect(() => {
        getOption();
    }, []);

    const getOption = () => {
        let numberOfOption = Numbers ? Numbers : 50;
        let options = new Array();
        for (let i = 0; i < numberOfOption; i++) {
            options.push({
                label: `${i}`,
                value: `${i}`
            });
        }
        setOption(options);
    }

    return (
        <Select
            label={label ? label : "Quantity"}
            name={name? name: "quantity"}
            options={options}
            data={preloadedValues}
            control={control}
            getDetails={(value) => onChange && onChange(value)}
            placeholder="Select Quantity"
            required={true}
            disableSearch
        />
    )
}

export default Quantity