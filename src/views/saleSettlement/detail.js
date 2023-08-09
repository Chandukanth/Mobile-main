import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { TouchableOpacity, StyleSheet, View, Button, Text, Image, ScrollView } from "react-native";
import DatePicker from "../../components/DatePicker";
import Select from "../../components/Select";
import Currency from "../../components/Currency";
import { useIsFocused } from "@react-navigation/native";
import storeService from "../../services/StoreService";
import shiftService from "../../services/ShiftService";
import userService from "../../services/UserService";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import CurrenCy from "../../lib/Currency";
import Permission from "../../helper/Permission";
import FooterButtons from "../../components/FooterButtons";
import TextField from "../../components/TextBox";
import DateTime from "../../lib/DateTime";
import { Sale } from "../../helper/Sale";
import * as ImagePicker from "expo-image-picker";
import mediaService from "../../services/MediaService";
import saleSettlementService from "../../services/SaleSettlementService";
import Spinner from "../../components/Spinner";
import PermissionService from "../../services/PermissionService";
import VerticalSpace10 from "../../components/VerticleSpace10";
import StoreSelect from "../../components/StoreSelect";
import UserSelect from "../../components/UserSelect"
import ShiftSelect from "../../components/ShiftSelect"
import TabName from '../../helper/Tab';
import Tab from "../../components/Tab";
import MediaList from "../../components/MediaList";
import ObjectName from "../../helper/ObjectName";
import StatusSelect from "../../components/StatusSelect";




const SaleSettlementDetail = (props) => {
    let details = props?.route?.params.item;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [userList, setuserList] = useState([]);
    const [amountCash, setAmountCash] = useState();
    const [amountUpi, setAmountUpi] = useState();
    const [totalAmount, setTotalAmount] = useState([""]);
    const [calculatedAmountCash, setCalculatedAmountCash] = useState();
    const [calculatedAmountUpi, setCalculatedAmountUpi] = useState();
    const [totalCalculatedAmount, setTotalCalculatedAmount] = useState([""]);
    const [receivedAmountCash, setReceivedAmountCash] = useState();
    const [receivedAmountUpi, setReceivedAmountUpi] = useState();
    const [totalReceivedAmount, setTotalReceivedAmount] = useState([""]);
    const [selectedStore, setSelectedStore] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [salesexecutive, setsalesExecutive] = useState("");
    const [notes, setNotes] = useState("");
    const [activeTab, setActiveTab] = useState(TabName.GENERAL);
    const [MediaData, setMediaData] = useState([]);
    const [editpermission, setEditPermission] = useState("")
    const [status, setStatus] = useState("")





    const navigation = useNavigation();

    const isFocused = useIsFocused();


    useEffect(() => {
        getStoreList();
        getShiftList();
        editPermission();
        getMediaList();
        getSalesExecutiveList();
    }, [isFocused]);

    useEffect(() => {
        updateDateValues();
    }, [storeList]);

    useEffect(() => {
        let mount = true;
        mount && editPermission()
        //cleanup function
        return () => {
            mount = false;
        };
    }, []);


    const getMediaList = async () => {
        await mediaService.search(details?.id, "SALE_SETTLEMENT", callback => setMediaData(callback?.data?.data))
    }


    const uploadImage = async (file, image) => {
        try {
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
                data.append("object", "SALE_SETTLEMENT");
                data.append("object_id", details?.id);
                data.append("media_url", image);
                data.append("media_visibility", 1);
                data.append("feature", 1);

                let mediaObj = [{
                    url: image
                }];

                if (MediaData && MediaData.length > 0) {
                    let updatedMediaList = [...mediaObj, ...MediaData]
                    setMediaData(updatedMediaList);
                } else {
                    setMediaData(mediaObj)
                }


                await mediaService.uploadMedia(navigation, data, async (error, response) => {
                    if (response) {
                        getMediaList();
                        // addNewEntry()
                    }
                    if (error) setIsLoading(false)

                });
            }
        }
        catch (err) {
        }

    };

    const removeImage = (id) => {
        mediaService.deleteMedia(id, response => {
            getMediaList();
        });
    }


    const takePicture = async () => {

        let permission = await ImagePicker.requestCameraPermissionsAsync()

        let mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission && permission.status == 'granted' && mediaPermission && mediaPermission.status == 'granted') {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });


            if (result && result.assets && result.assets.length > 0 && result.assets[0].uri) {
                const response = await fetch(result.assets[0].uri);
                if (response) {
                    const blob = await response.blob();


                    if (!result.canceled) {
                        addNewEntry(blob, result.assets[0].uri);
                    }
                }
            }
        }
    }

    const addNewEntry = async (file, image) => {
        await uploadImage(file, image)
    }



    const getShiftList = () => {
        //create new rray
        let shiftListOption = new Array();

        shiftService.getShiftList(null, (error, response) => {
            //validate shift list exist or nott
            let shiftList = response?.data?.data;

            //validate shift list
            if (shiftList && shiftList.length > 0) {
                //loop the shift list
                for (let i = 0; i < shiftList.length; i++) {
                    //push the shift list
                    shiftListOption.push({
                        label: shiftList[i].name,
                        value: shiftList[i].id,
                    });
                }
                //set the shift list
                setShiftList(shiftListOption);
            }
        })
    }



    const getSalesExecutiveList = () => {
        //create new rray
        let salesExecutiveList = new Array();
        userService.getSalesExecutiveList((error, response) => {
            let userList = response?.data?.data;
            if (userList && userList.length > 0) {
                for (let i = 0; i < userList.length; i++) {
                    let concatedName
                    if (userList[i].first_name && userList[i].last_name) {
                        concatedName = userList[i].first_name + " " + userList[i].last_name
                    } else if (userList[i].first_name) {
                        concatedName = userList[i].first_name;
                    } else if (userList[i].last_name) {
                        concatedName = userList[i].last_name;
                    }

                    salesExecutiveList.push({
                        label: (concatedName),
                        value: userList[i].id,
                    });
                }
            }
            setuserList(salesExecutiveList);
        })
    }

    const updateDateValues = () => {


        let date = details?.date;

        if (date) {
            setSelectedDate(new Date(date));
        }
    }

    const handleStoreOnchange = (data) => {
        setSelectedStore(data);
    };

    const handleShiftOnChange = (value) => {
        setSelectedShift(value.value)

    }

    const handleNotesOnChange = (value) => {
        setNotes(value)
    }

    const handleSalesExecutiveChange = (value) => {
        setsalesExecutive(value.value)
    }

    const editPermission = async () => {
        const editPermission = await PermissionService.hasPermission(Permission.SALE_SETTLEMENT_EDIT);
        setEditPermission(editPermission);
    }
    const handleStatusOnChange = async (value) => {
        setStatus(value)
      }

    const preloadedValues = {
        id: details?.id,
        date: details?.date ? details?.date : selectedDate,
        amount_cash: details?.amount_cash,
        amount_upi: amountUpi ? amountUpi : details?.amount_upi,
        total_amount: details?.total_amount,
        calculated_amount_cash: calculatedAmountCash ? calculatedAmountCash : details?.calculated_amount_cash,
        calculated_amount_upi: calculatedAmountUpi ? calculatedAmountUpi : details?.calculated_amount_upi,
        total_calculated_amount: details?.total_calculated_amount,
        cash_in_store: details?.cash_in_store,
        cash_to_office: details?.cash_to_office,
        discrepancy_amount_cash: discrepancyAmountCash ? discrepancyAmountCash : details?.discrepancy_amount_cash,
        discrepancy_amount_upi: discrepancyAmountUpi ? discrepancyAmountUpi : details?.discrepancy_amount_upi,
        Notes: notes ? notes : details?.notes,
        productCount: details?.productCount,
        received_amount_cash: receivedAmountCash ? receivedAmountCash : details?.received_amount_cash,
        received_amount_upi: receivedAmountUpi ? receivedAmountUpi : details?.received_amount_upi,
        salesExecutive: salesexecutive ? salesexecutive : details?.sales_executive,
        shift: selectedShift ? selectedShift : details?.shiftId,
        storeId: selectedStore ? selectedStore : details?.storeId,
        status : status ? status : details?.statusId,
        type: "",
        total_received_amount: details?.total_received_amount,
        productCount: details?.product_count ? details?.product_count.toString() : " "
    };
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues,
    });

    const getStoreList = () => {
        storeService.list((error, response) => {
            const storeListOption = new Array();
            let storeList = response?.data?.data;
            if (storeList && storeList.length > 0) {
                for (let i = 0; i < storeList.length; i++) {
                    storeListOption.push({
                        label: storeList[i].name,
                        value: storeList[i].id,
                    });
                }

                setStoreList(storeListOption);
            }

        });
    }

    const UpdateSaleSettlement = (values) => {
        const updateData = {
            id: details.id,
            date: DateTime.formatDate(selectedDate),
            amount_cash: amountCash ? amountCash : details.amount_cash,
            amount_upi: amountUpi ? amountUpi : details.amount_upi,
            total_amount: CurrenCy.Get(amountCash) + CurrenCy.Get(amountUpi) ? CurrenCy.Get(amountCash) + CurrenCy.Get(amountUpi) : CurrenCy.Get(details.amount_cash) + CurrenCy.Get(details.amount),
            calculated_amount_cash: calculatedAmountCash ? calculatedAmountCash : details.calculated_amount_cash ? calculatedAmountCash ? calculatedAmountCash : details.calculated_amount_cash : 0,
            total_calculated_amount: totalCalculatedAmount ? totalCalculatedAmount : details.total_calculated_amount,
            calculated_amount_upi: calculatedAmountUpi ? calculatedAmountUpi : details.calculated_amount_upi ? calculatedAmountUpi ? calculatedAmountUpi : details.calculated_amount_upi : 0,
            cash_in_store: values?.cash_in_store ? values?.cash_in_store : details?.cash_in_store,
            cash_to_office: values.cash_to_office ? values.cash_to_office : details?.cash_to_office,
            discrepancy_amount_cash: discrepancyAmountCash ? discrepancyAmountCash : details.discrepancy_amount_cash ? discrepancyAmountCash ? discrepancyAmountCash : details.discrepancy_amount_cash : 0,
            discrepancy_amount_upi: discrepancyAmountUpi ? discrepancyAmountUpi : details.discrepancy_amount_upi ? discrepancyAmountUpi ? discrepancyAmountUpi : details.discrepancy_amount_upi : 0,
            notes: notes ? notes : details.notes,
            received_amount_cash: receivedAmountCash ? receivedAmountCash : details.received_amount_cash ? receivedAmountCash ? receivedAmountCash : details.received_amount_cash : 0,
            received_amount_upi: receivedAmountUpi ? receivedAmountUpi : details.received_amount_upi ? receivedAmountUpi ? receivedAmountUpi : details.received_amount_upi : 0,
            total_received_amount: totalReceivedAmount ? totalReceivedAmount : details.total_received_amount,
            salesExecutive: salesexecutive ? salesexecutive : details.sales_executive,
            shift: selectedShift ? selectedShift : details.shiftId,
            storeId: selectedStore ? selectedStore : details.storeId,
            status : status ? status : details?.statusId,
            type: "",
        };

        saleSettlementService.update(details?.id, updateData, (callback) => {
            navigation.navigate("SalesSettlement")
        })
    }

    const completeSaleSettlement = async () => {
        await saleSettlementService.updateStatus(details?.id, { status: Sale.STATUS_COMPLETE }, callback => {
        });
        navigation.navigate("SalesSettlement");
    };
    const reviewSaleSettlement = async () => {
        await saleSettlementService.updateStatus(details?.id, { status: Sale.STATUS_REVIEW }, callback => {
        });
        navigation.navigate("SalesSettlement");
    }


    const onDateSelect = (date) => {
        //update the selected date
        setSelectedDate(new Date(date));
    }


    const onCashChange = (value) => {
        const cashAmount = value;

        setAmountCash(value)
        if (cashAmount) {
            let totalAmounts = CurrenCy.Get(cashAmount) + CurrenCy.Get(amountUpi)
            setTotalAmount(totalAmounts || "")
        }
        setAmountCash(cashAmount)
    };

    const onUpiChange = (value) => {
        const upiAmount = value;

        if (upiAmount) {
            let total_amount = CurrenCy.Get(amountCash) + CurrenCy.Get(upiAmount)

            setTotalAmount(total_amount || "")
        }
        setAmountUpi(upiAmount)
    };

    const onCalculatedCashChange = (value) => {
        const calculatedCashAmount = value;

        setCalculatedAmountCash(value)
        if (calculatedCashAmount) {
            let totalAmounts = CurrenCy.Get(calculatedCashAmount) + CurrenCy.Get(calculatedAmountUpi)
            setTotalCalculatedAmount(totalAmounts || "")
        }
        setCalculatedAmountCash(calculatedCashAmount)
    };

    const onCalculatedUpiChange = (value) => {
        const calculatedUpiAmount = value;

        if (calculatedUpiAmount) {
            let total_amount = CurrenCy.Get(calculatedAmountCash) + CurrenCy.Get(calculatedUpiAmount)

            setTotalCalculatedAmount(total_amount || "")
        }
        setCalculatedAmountUpi(calculatedUpiAmount)
    };

    const onReceivedCashChange = (value) => {
        const receivedCashAmount = value;

        if (receivedCashAmount) {
            let totalAmounts = CurrenCy.Get(receivedCashAmount) + CurrenCy.Get(receivedAmountUpi)
            setTotalReceivedAmount(totalAmounts || "")
        }
        setReceivedAmountCash(receivedCashAmount)
    };

    const onReceivedUpiChange = (value) => {
        const receivedAmountUpi = value;

        if (receivedAmountUpi) {
            let total_amount = CurrenCy.Get(receivedAmountCash) + CurrenCy.Get(receivedAmountUpi)

            setTotalReceivedAmount(total_amount || "")
        }
        setReceivedAmountUpi(receivedAmountUpi)
    };

    const discrepancyAmountCash = CurrenCy.Get(amountCash ? amountCash : details?.amount_cash) - CurrenCy.Get(calculatedAmountCash ? calculatedAmountCash : details?.calculated_amount_cash)
    const discrepancyAmountUpi = CurrenCy.Get(amountUpi ? amountUpi : details?.amount_upi) - CurrenCy.Get(calculatedAmountUpi ? calculatedAmountUpi : details?.calculated_amount_upi)
    const totalDiscrepancy = CurrenCy.Get(discrepancyAmountCash) + CurrenCy.Get(discrepancyAmountUpi)

    if (isLoading) {
        return <Spinner />;
    }



    return (
        <Layout
            title={`Sales Settlement#: ${details?.saleSettlementNumber}`}
            showBackIcon={true}
            backButtonNavigationUrl={"SalesSettlement"}
            buttonOnPress={(e) => activeTab === TabName.ATTACHMENTS && takePicture(e)}
            buttonLabel={activeTab === TabName.ATTACHMENTS && "Upload"}
            FooterContent={<FooterButtons errors={errors} show={editpermission ? true : false}
                onPressCancel={() => {
                    navigation.navigate("SalesSettlement");
                }}
                onPressUpdate={handleSubmit(values => { UpdateSaleSettlement(values) })}
            />}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.tabBar}>
                        <Tab
                            title={TabName.GENERAL}
                            isActive={activeTab === TabName.GENERAL}
                            onPress={() => setActiveTab(TabName.GENERAL)}
                        />
                        <Tab
                            title={TabName.ATTACHMENTS}
                            isActive={activeTab === TabName.ATTACHMENTS}
                            onPress={() => setActiveTab(TabName.ATTACHMENTS)}
                        />
                    </View>
                    {activeTab === TabName.GENERAL && (
                        <><DatePicker
                            title="Date"
                            onDateSelect={onDateSelect}
                            disabled={editpermission ? true : false}
                            selectedDate={selectedDate ? selectedDate : details.date} />
                            <VerticalSpace10  />

                            <View style={styles.container1}>

                                <View style={styles.item}>
                                    <StoreSelect
                                        options={storeList}
                                        label={"Location"}
                                        name={"Store"}
                                        data={details?.storeId ? details?.storeId : selectedStore}
                                        placeholder={"Select Location"}
                                        disable={editpermission ? false : true}
                                        onChange={handleStoreOnchange}
                                        control={control} />
                                </View>

                                <View style={{ paddingLeft: 8, width: "50%" }}>
                                    <ShiftSelect
                                        options={shiftList}
                                        label={"Shift"}
                                        data={details?.shiftId ? details?.shiftId : selectedShift}
                                        disableSearch
                                        disable={editpermission ? false : true}
                                        placeholder={"Select Shift"}
                                        onChange={handleShiftOnChange}
                                        control={control} />
                                </View>
                            </View>

                            <VerticalSpace10  />

                            <UserSelect
                                options={userList}
                                label={"SalesExecutive"}
                                selectedUserId={details?.sales_executive ? details?.sales_executive : salesexecutive}
                                placeholder={"Select SalesExecutive"}
                                disable={editpermission ? false : true}
                                userCard
                                onChange={handleSalesExecutiveChange}
                                control={control} />
                            <VerticalSpace10  />


                            <StatusSelect
                                label={"Status"}
                                onChange={handleStatusOnChange}
                                object={ObjectName.SALE_SETTLEMENT}
                                control={control}
                                placeholder={"Select Status"} 
                                data={details?.statusId ? Number(details?.statusId) : status}
                                                           />
                            <VerticalSpace10  />

                            <View style={styles.container1}>

                                <View style={styles.item}>
                                    <Currency
                                        title={"Amount Cash"}
                                        name="amount_cash"
                                        control={control}
                                        placeholder="Amount Cash"
                                        edit={editpermission ? true : false}
                                        onInputChange={onCashChange} />

                                </View>

                                <View style={{ paddingLeft: 8, width: "50%" }}>
                                    <Currency
                                        title={"Amount UPI"}
                                        name="amount_upi"
                                        control={control}
                                        placeholder="Amount UPI"
                                        edit={editpermission ? true : false}
                                        onInputChange={onUpiChange} />
                                </View>
                            </View>
                            <VerticalSpace10  />


                            <Currency
                                title={"Total Amount"}
                                name="total_amount"
                                control={control}
                                placeholder="Total Amount"
                                values={totalAmount.toString()}
                                noEditable />
                            <VerticalSpace10  />

                            <Currency
                                name="cash_in_store"
                                title={"Cash In store"}
                                control={control}
                                placeholder="Cash In store"
                                edit={editpermission ? true : false}
                            />
                            <VerticalSpace10  />


                            <Currency
                                name="cash_to_office"
                                title={"Cash To Office"}
                                control={control}
                                placeholder="Cash To Office"
                                edit={editpermission ? true : false}
                            />

                            <VerticalSpace10  />

                            <View style={styles.container1}>

                                <View style={styles.item}>

                                    <Currency
                                        title={"Calculated Amount Cash"}
                                        name="calculated_amount_cash"
                                        control={control}
                                        placeholder=" Calculated Amount Cash"
                                        values={calculatedAmountCash ? calculatedAmountCash : details?.calculated_amount_cash}
                                        onInputChange={onCalculatedCashChange}
                                        edit={editpermission ? true : false}

                                    />
                                </View>

                                <View style={{ paddingLeft: 8, width: "50%" }}>
                                    <Currency
                                        title={"Calculated Amount UPI"}
                                        name="calculated_amount_upi"
                                        control={control}
                                        placeholder="Calculated Amount UPI"
                                        onInputChange={onCalculatedUpiChange}
                                        edit={editpermission ? true : false}

                                    />
                                </View>
                            </View>
                            <VerticalSpace10  />

                            <Currency
                                title={"Total Calculated Amount"}
                                name="total_calculated_amount"
                                control={control}
                                placeholder="Total Calculated Amount"
                                values={totalCalculatedAmount.toString()}
                                noEditable />

                            <VerticalSpace10  />

                            <View style={styles.container1}>

                                <View style={styles.item}>

                                    <Currency
                                        title={"Received Amount Cash"}
                                        name="received_amount_cash"
                                        control={control}
                                        placeholder=" Received Amount Cash"
                                        onInputChange={onReceivedCashChange}
                                        edit={editpermission ? true : false}

                                    />
                                </View>

                                <View style={{ paddingLeft: 8, width: "50%" }}>
                                    <Currency
                                        title={"Recieved Amount UPI"}
                                        name="received_amount_upi"
                                        control={control}
                                        placeholder="Recieved Amount UPI"
                                        onInputChange={onReceivedUpiChange}
                                        edit={editpermission ? true : false}

                                    />
                                </View>
                            </View>
                            <VerticalSpace10  />


                            <Currency
                                title={"Total Received Amount"}
                                name="total_received_amount"
                                control={control}
                                placeholder="Total Received Amount"
                                values={totalReceivedAmount.toString()}
                                noEditable />
                            <VerticalSpace10  />

                            <View style={styles.container1}>

                                <View style={styles.item}>

                                    <Currency
                                        name="discrepancy_amount_cash"
                                        title={"Discrepancy Amount Cash"}
                                        control={control}
                                        placeholder="Discrepancy Amount Cash"
                                        values={discrepancyAmountCash.toString()}
                                        noEditable />
                                </View>

                                <View style={{ paddingLeft: 8, width: "50%" }}>
                                    <Currency
                                        name="discrepancy_amount_upi"
                                        title={"Discrepancy Amount UPI"}
                                        control={control}
                                        placeholder="Discrepancy Amount UPI"
                                        values={discrepancyAmountUpi.toString()}
                                        noEditable />
                                </View>
                            </View>

                            <VerticalSpace10  />

                            <Currency
                                name="total_discrepancy_amount"
                                title={"Total Discrepancy Amount"}
                                control={control}
                                placeholder="Total Discrepancy Amount"
                                values={totalDiscrepancy.toString()}
                                noEditable />
                            <VerticalSpace10  />

                            <TextField
                                name="Notes"
                                placeholder="Notes"
                                title="Notes"
                                control={control}
                                values={details?.notes}
                                onInputChange={handleNotesOnChange}
                                editable={editpermission ? true : false}

                            /></>
                    )}
                    {activeTab === TabName.ATTACHMENTS && (

                        <MediaList
                            mediaData={MediaData}
                            getMediaList={getMediaList}
                        />
                    )}
                </View>


            </ScrollView>
        </Layout>
    );
};
export default SaleSettlementDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "scroll",
        backgroundColor: "#fff",
    },
    container1: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    item: {
        width: '50%'
    },
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabTitle: {
        fontSize: 14,
    },
    activeTab: {
        backgroundColor: 'lightgrey',
    },
    activeTabTitle: {
        fontWeight: 'bold',
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
