
//React
import React, { useState } from "react";
import { View, ScrollView } from "react-native";

//Components
import Currency from "../../components/Currency";
import FileUpload from "../../components/FileUpload";
import AddButton from "../../components/AddButton";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import OrderService from "../../services/OrderService";
import MediaService from "../../services/MediaService";
import { useNavigation } from "@react-navigation/native";
import TextInput from "../../components/TextInput";

const AddOrderProduct = (props) => {
    const [image, setImage] = useState("");
    const [file, setFile] = useState("");

    const orderId = props?.route?.params?.orderId;
    const storeId = props?.route?.params?.storeId;
    const totalAmount = props?.route?.params?.totalAmount;

    const preloadedValues = {
        quantity: "",
        sale_price: "",
    };

    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });


    const uploadImage = (objectId, orderProductId) => {
        if (file) {
            const data = new FormData();
            let files = {
                type: file?._data?.type,
                size: file?._data.size,
                uri: image,
                name: file?._data.name,
            };
            data.append("media_file", files);
            data.append("media_name", file?._data.name);
            data.append("object", "PRODUCT");
            data.append("object_id", objectId);
            data.append("media_visibility", 1);
            MediaService.uploadMedia(navigation, data, (error, response) => {
                if (orderProductId && response && response.id) {
                    OrderService.updateOrderProduct(orderProductId, { mediaId: response.id }, () => {
                        navigation.navigate("Order/ProductList", {
                            id: orderId,
                            storeId: storeId,
                            totalAmount: totalAmount
                        });
                    })
                } else {
                    navigation.navigate("Order/ProductList", {
                        id: orderId,
                        storeId: storeId,
                        totalAmount: totalAmount
                    });
                }
            });

        } else {
            navigation.navigate("Order/ProductList", {
                id: orderId,
                storeId: storeId,
                totalAmount: totalAmount
            });
        }
    };

    const onPress = (values) => {
        try {
            let createData = { unit_price: values.sale_price, quantity: values.quantity, isUnKnownProduct: true, orderId: orderId, storeId: storeId }
            OrderService.addOrderProduct(createData, (err, response) => {
                if (response && response.data && response.data.unKnownProductId) {
                    //create order update body data

                    let currentPrice = parseFloat(values.sale_price) * parseFloat(values.quantity);

                    const data = {
                        storeId: storeId,
                        total_amount:
                            parseFloat(totalAmount) + parseFloat(currentPrice),
                    };

                    uploadImage(response.data.unKnownProductId, response.data.orderProductDetail.id)

                    //update the order 
                    OrderService.updateOrder(orderId, data, (error, orderResponse) => { });
                } else {
                    navigation.navigate("Order/ProductList", {
                        id: orderId,
                        storeId: storeId,
                        totalAmount: totalAmount
                    });
                }
            })
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <Layout title={"Add Product"} showBackIcon>
            <ScrollView>
                <View style={{ marginTop: 10, padding: 10 }}>
                    <FileUpload image={image ? image : ""} setImage={setImage} setFile={setFile} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <View style={{ flex: 1, paddingRight: 5 }} >
                            <TextInput
                                title="Quantity"
                                name="quantity"
                                placeholder="Enter Quantity"
                                control={control}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Currency
                        title="Sale Price"
                        name="sale_price"
                        control={control}
                        edit
                    />

                    <View style={{ paddingVertical: 20 }}>
                        <AddButton onPress={handleSubmit((values) => onPress(values))} />
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
};

export default AddOrderProduct;
