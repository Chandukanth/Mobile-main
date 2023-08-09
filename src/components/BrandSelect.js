import React,{useState, useEffect} from "react";
import Select from './Select'
import { useIsFocused } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import brandService from "../services/BrandService";

const BrandSelect = (props) => {
    const {data, label, onChange} = props
    const [brandList, setBrandList] = useState([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        getBrandList();
      }, [isFocused]);

      const {
        control,
        formState: { errors },
      } = useForm({
      });

      const getBrandList = () => {
        brandService.getBrandList((response) => {
            const brandListOption = new Array();

            let brandList = response;
            if (brandList && brandList.length > 0) {
                for (let i = 0; i < brandList.length; i++) {
                    brandListOption.push({
                        label: brandList[i].label,
                        value: brandList[i].value,
                    }); 0
                }

                setBrandList(brandListOption);
            }

        });
    }

    return(
        <Select
        control={control}
        options={brandList}
        getDetails={onChange}
        label={label}
        placeholder={"Select Brand"}
        data={data}
      />
    )
};
export default BrandSelect;
