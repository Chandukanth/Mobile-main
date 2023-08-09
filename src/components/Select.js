import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import ProductCard from "../components/ProductCard";
import UserAvatar from "react-native-user-avatar";
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Label from './Label';
import CustomDivider from './Divider';

const Select = ({ name, options, label, placeholder, divider, OnSelect, getDetails, data, disableSearch, showBorder, required, paddingVertical, control, disable, showImage, userCard }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const borderShow = showBorder === undefined ? true : showBorder

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          {label}
        </Text>
      );
    }
    return null;
  };

  const _renderItem = item => {
    return (
      <View>


        {showImage ? (

          <ProductCard
            name={item.label}
            brand={item.brand}
            sale_price={item.sale_price}
            mrp={item.mrp}
            image={item.image}
            disabled={true}
            onPress={() => OnSelect ? OnSelect(item.value) : ""} />

        ) : userCard ? (
          <View
            style={{
              // justifyContent: "flex-end",
              alignItems: "flex-start",
              flexDirection: 'row',
              height: 50,
              flex: 1
            }}
          >
            <UserAvatar
              size={40}
              name={item.label}
              src={item.media_url}
              bgColor="#000"
            />
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.5, paddingTop: 10 }}>
              {item.label && (
                <Text>{item.label}</Text>
              )}
            </View>
          </View>
        ) :
          (
            <View style={styles.item}>
              {item.label && (
                <Text style={[styles.textItem, { marginLeft: 10 }]}>{item.label}</Text>
              )}
            </View>
          )}
      </View>
    );
  };

  return (
    <Controller
      control={control}
      name={name ? name : ""}
      rules={!data && required ? { required: `Enter ${placeholder}` } : ""}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <>
          <View style={{ flexDirection: 'row' }}>
            {label && <Label text={label} bold={true} />}
            {label && required && <Text style={{ color: 'red' }}>*</Text>}
          </View>
          <View
            style={[
              styles.container,
              { borderColor: error ? 'red' : 'gray', borderWidth: borderShow ? 1 : 0, borderRadius: 8 },
            ]}>
            {/* {renderLabel()} */}
            <Dropdown
              disable={disable}
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={options}
              renderRightIcon={() => (value ?
                <TouchableOpacity onPress={(e) => {
                  onChange("");
                  setValue("");
                  setIsFocus(false);
                  OnSelect ? OnSelect("") : "";
                  getDetails ? getDetails("") : "";
                }}>
                  <Ionicons name="close" size={20} color="grey" />
                </TouchableOpacity> : <Ionicons name="chevron-down" size={20} color="grey" />
              )}
              iconContainerStyle={{ marginLeft: 10 }}
              search={disableSearch ? false : true}
              maxHeight={500}
              labelField="label"
              valueField="value"
              dropdownPosition='bottom'
              placeholder={!isFocus ? placeholder : '...'}
              searchPlaceholder="Search..."
              renderItem={item => _renderItem(item)}
              value={value || data}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                onChange(item);
                setValue(item.value);
                setIsFocus(false);
                OnSelect ? OnSelect(item.value) : "";
                getDetails ? getDetails(item) : "";
              }}
            />
          </View>
          {divider && (
            <CustomDivider />
          )}
          {error && (
            <Text style={{ color: 'red', alignSelf: 'stretch' }}>{`${placeholder ? label : label} is required`}</Text>
          )}
        </>
      )}
    />
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  dropdown: {
    height: 50,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "#8b9cb5"
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    width: 38,
    height: 38,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
});