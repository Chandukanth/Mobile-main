import React from "react";
import TextInput from "./TextInput";

const Name = (props) => {
    const { values, name,title, onInputChange, required,control } = props;
return (
    <TextInput
        title={title}
        name={name}
        showBorder={true}
        values={values}
        onInputChange={onInputChange}
        control={control}
        required={required}
    />
)
}
export default Name;