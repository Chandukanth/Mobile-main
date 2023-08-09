
//React
import React from "react";
import { View, ScrollView } from "react-native";

//Components
import Select from "../../../components/Select";
import Currency from "../../../components/Currency";
import FileUpload from "../../../components/FileUpload";
import AddButton from "../../../components/AddButton";
import TextInput from "../../../components/TextInput";
import VerticalSpace10 from "../../../components/VerticleSpace10";

const ProductForm = (props) => {
  const {
    control,
    brandList,
    categoryList,
    weightUnitOptions,
    handleBrand,
    handleStatus,
    handleCategory,
    handleUnit,
    statusOptions,
    StatusData,
    brandData,
    categoryData,
    unitData,
    onPress,
    details,
    image,
    setImage,
    setFile
  } = props;

  return (
    <ScrollView>
      <View style={{ marginTop: 10, padding: 10 }}>
        <FileUpload image={image ? image : ""} prefillImage={details?.image} setImage={setImage} setFile={setFile} />
        <TextInput
          title="Name"
          name="name"
          placeholder="Product Name"
          control={control}
          required
        />
        <VerticalSpace10  />

        <Select
          options={statusOptions}
          data={StatusData}
          getDetails={handleStatus}
          label={"Status"}
          placeholder={"Select Status"}
          control={control}
        />
        <VerticalSpace10  />

        <Select
          options={brandList}
          getDetails={handleBrand}
          data={brandData}
          label={"Brand"}
          placeholder={"Select Brand"}
          control={control}
        />
        <VerticalSpace10  />

        <Select
          options={categoryList}
          getDetails={handleCategory}
          data={categoryData}
          label={"Category"}
          placeholder={"Select Category"}
          control={control}
        />
        <VerticalSpace10  />

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ flex: 1, paddingRight: 5 }} >
            <TextInput
              title="Size"
              name="size"
              placeholder="Enter Size"
              control={control}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, paddingLeft: 5 }}>
            <Select
              options={weightUnitOptions}
              getDetails={handleUnit}
              data={unitData}
              label={"Unit"}
              placeholder={"Select Unit"}
              paddingVertical
              control={control}
            />
          </View>

        </View>
        <VerticalSpace10  />

        <Currency
          title="MRP"
          name="mrp"
          control={control}
          edit
        />
        <VerticalSpace10  />

        <Currency
          title="Sale Price"
          name="sale_price"
          control={control}
          edit
        />
        <VerticalSpace10  />

        <TextInput
          title="Barcode"
          name="barcode"
          placeholder="Enter Barcode"
          keyboardType="numeric"
          control={control}
        />

        <View style={{ paddingVertical: 20 }}>
          <AddButton data={details?.name} onPress={onPress} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductForm;
