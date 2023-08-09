import DropDownPicker from 'react-native-dropdown-picker';

import React, { useState } from 'react';

function DropDownImage({ options, OnSelect, value }) {
   
    const [open, setOpen] = useState(false);

    return (
        <DropDownPicker
            value={value}
            open={open}
            searchable={true}
            items={options}
            setOpen={setOpen}
            setValue={OnSelect}
            dropDownContainerStyle={{height : 400}}
        />

    );
}


export default DropDownImage;
