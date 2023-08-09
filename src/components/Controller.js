import React from "react";
import { Controller } from 'react-hook-form';
const Controllers = ({ control, name, required, placeholder, children }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: `Enter ${placeholder}` } : ""}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        children({ value, onChange, onBlur, error })
      )}
    />
  );
}
export default Controllers;