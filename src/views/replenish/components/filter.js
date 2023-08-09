import React, { useEffect, useState } from 'react';

import BottomDrawer from "../../../components/BottomDrawer";

import Select from "../../../components/Select";

import { useForm } from "react-hook-form";

import { Button, View } from "react-native";

import { Color } from "../../../helper/Color";

import CategoryService from "../../../services/CategoryService";

import BrandService from "../../../services/BrandService";

const FilterDrawer = ({ isOpen, onClose, closeDrawer, categoryOnSelect, brandOnSelect, applyFilter }) => {
  const [categoryList, setCatgoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: {} });

  useEffect(() => {
    getFilterList();
  }, []);

  const getFilterList = () => {
    CategoryService.getCategoryList(setCatgoryList);
    BrandService.getBrandList(setBrandList);
  }

  const CloseDrawer = () => {
    closeDrawer();
  }

  return (
    <>
      <BottomDrawer isOpen={isOpen} onClose={onClose} title={"Product Filter"} closeDrawer={CloseDrawer} applyFilter={applyFilter}>

        <Select
          label="Brand"
          options={brandList}
          control={control}
          placeholder="Select Brand"
          disableSearch={true}
          OnSelect={brandOnSelect}
        />

        <Select
          label="Category"
          options={categoryList}
          control={control}
          placeholder="Select Category"
          disableSearch={true}
          OnSelect={categoryOnSelect}
        />
      </BottomDrawer>
    </>
  )
};

export default FilterDrawer;