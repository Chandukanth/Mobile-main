// Import React and Component
import React, { useState, useEffect, useCallback } from "react";

import { useNavigation } from "@react-navigation/native";

// Component
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorageConstants from "../../helper/AsyncStorage";
import apiClient from "../../apiClient";
import { endpoints } from "../../helper/ApiEndPoint";
// Spinner
import Spinner from "../../components/Spinner";
import { StatusText, weightUnitOptions, Status } from "../../helper/product";
import Layout from "../../components/Layout";
import { statusOptions } from "../../helper/product";
import { useForm } from "react-hook-form";
import ProductForm from "./components/ProductForm";

import MediaService from "../../services/MediaService";

import ProductService from "../../services/ProductService";

import SpinnerOverlay from 'react-native-loading-spinner-overlay';

import { Color } from "../../helper/Color";
import { ErrorMessage } from "../../helper/ErrorMessage";
import brandService from "../../services/BrandService";
import categoryService from "../../services/CategoryService";

const StoreSelectionScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [brandValue, setBrandValue] = useState();
  const [categoryValue, setCategoryValue] = useState();
  const [brandList, setBrandList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [unit, setUnit] = useState();
  const [status, setStatus] = useState();
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [overlayLoader, setOverlayLoader] = useState(null);

  // render the inventory list function
  useEffect(() => {
    let mount = true;
    mount && getBrandList();
    mount && getCategoryList();

    //cleanup function
    return () => {
      mount = false;
    };
  }, []);

  const params = props?.route.params;

  const navigation = useNavigation();
  const preloadedValues = {
    name: props?.route.params?.name,
    barcode: props?.route.params?.barcode,
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues
  });

  // Get inventory transfer∂ß list
  const getBrandList = async () => {
    try {
      brandService.getBrandList((response)=>{
        setBrandList(response);

      })
        setIsLoading(false);
    
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleBrand = (value) => {
    setBrandValue(value);
  };

  const handleStatus = (value) => {
    setStatus(value);
  };

  const handleCategory = (value) => {
    setCategoryValue(value);
  };

  const handleUnit = (value) => {
    setUnit(value);
  };

  const uploadImage = (productDetails, callback) => {

    if (productDetails && file) {

      const data = new FormData();

      let mediaFile = {
        type: file?._data?.type,
        size: file?._data.size,
        uri: image,
        name: file?._data.name
      }

      data.append("media_file", mediaFile)

      data.append("image_name", file?._data.name);

      data.append("name", file?._data.name);

      data.append("media_name", file?._data.name);

      data.append("object", "PRODUCT");

      data.append("object_id", productDetails?.id);

      data.append("media_url", image);

      data.append("media_visibility", 1);

      data.append("feature", 1);

      MediaService.uploadMedia(navigation, data, (error, response) => {
        //reset the state
        setFile("");
        setImage("");
        return callback();
      })
    } else {
      return callback();
    }
  }

  const AddProducts = async (values) => {
    try {
      if (values.name) {

        let bodyData = {
          name: values.name,
          brand_id: brandValue ? brandValue.value : "",
          brandName: brandValue ? brandValue.label : "",
          category_id: categoryValue ? categoryValue.value : "",
          category_name: categoryValue ? categoryValue.label : "",
          salePrice: values.sale_price,
          mrp:values.mrp,
          barcode: values.barcode,
          size: values.size,
          unit: unit ? unit.value : "",
        };
        if (status) {
          bodyData.status = status.value;
        }
        ProductService.addProduct(navigation, bodyData, (error, response) => {

          //validate response exist or not
          if (response && response.data && response.data.productDetails) {

            //get the product details
            let productDetails = response?.data?.productDetails;

            setOverlayLoader(true);

            //upload the image
            uploadImage(productDetails, () => {

              setOverlayLoader(false);

              ProductService.reindex(productDetails.id,()=> {})

              navigation.navigate("Products");

            })
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  // Get catgeory list
  const getCategoryList = async () => {
    try {
      categoryService.getCategoryList((response) => {
        setCategoryList(response);

      })
        setIsLoading(false);

    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  /* Render flat list funciton end */
  return (
    <Layout title={"Add Product"} showBackIcon>

      <SpinnerOverlay
        visible={overlayLoader}
        textContent={'Image Uploading ...'}
        textStyle={{ color: "#fff", }}
        color={Color.PRIMARY}
      />
      <ProductForm
        control={control}
        statusOptions={statusOptions}
        brandList={brandList}
        handleBrand={handleBrand}
        categoryList={categoryList}
        handleStatus={handleStatus}
        weightUnitOptions={weightUnitOptions}
        handleCategory={handleCategory}
        handleUnit={handleUnit}
        image={image}
        StatusData={StatusText(Status.DRAFT)}
        setImage={setImage}
        setFile={setFile}
        onPress={handleSubmit((values) => AddProducts(values))}
      />
    </Layout>
  );
};

export default StoreSelectionScreen;
