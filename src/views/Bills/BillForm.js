import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import VerticalSpace10 from "../../components/VerticleSpace10";
import accountService from "../../services/AccountService";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AccountSelect from "../../components/AccountSelect";
import DoneButton from "../../components/DoneButton";
import Number from "../../components/Number";
import AddressSelect from "../../components/AddressSelect";
import addressServices from "../../services/AddressService";
import DatePicker from "../../components/DatePicker";
import Currency from "../../components/Currency";
import billService from "../../services/BillService";
import SaveButton from "../../components/SaveButton";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
import Tab from "../../components/Tab";
import TabName from '../../helper/Tab';
import MediaList from "../../components/MediaList";
import mediaService from "../../services/MediaService";
import ObjectName from "../../helper/ObjectName";
import Media from "../../helper/Media";





const BillForm = (props) => {
    const params = props?.route?.params?.item
    const param = props?.route?.params
    let id = params?.id
    const [vendorList, setVendorList] = useState();
    const [addressList, setAddressList] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [billingName, setBillingName] = useState();
    const [accountName, setAccountName] = useState(params?.account_id || "");
    const [netAmount, setNetAmount] = useState(params?.net_amount || "");
    const [noEdit, setNoEdit] = useState(false);
    const [permission, setPermission] = useState("")
    const [activeTab, setActiveTab] = useState(TabName.SUMMARY);
    const [MediaData, setMediaData] = useState([]);




    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const preloadedValues = {
        id: params?.id,
        billing_name: params?.billing_name,
        account_id: params?.account_id,
        amount: params?.amount || "",
        invoice_number: params?.invoice_number,
        date: params?.bill_date ? params?.bill_date : selectedDate,

    }
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });

    useEffect(() => {
        let mount = true;
        mount && updateDateValues();
        mount && editPermission();
        mount && getMediaList();

        mount && accountService.GetList(null, (callback) => { setVendorList(callback) })
        mount && addressServices.search({}, callback => { setAddressList(callback); })


        //cleanup function
        return () => {
            mount = false;
        };
    }, [isFocused])
    const takePicture = async (e) => {
        const image = await Media.getImage();
        if (image && image.assets) {
            const response = await fetch(image.assets[0].uri);
            const blob = await response.blob();
            await Media.uploadImage(params?.id ? params?.id : param?.id, blob, image.assets[0].uri, ObjectName.BILL, null, null, async (response) => {
                if (response) {
                    getMediaList();
                }
            })
        }
    };
    const getMediaList = async () => {
        await mediaService.search(params?.id, ObjectName.BILL, (callback) => setMediaData(callback.data.data))
    }


    const editPermission = async () => {
        const editPermission = await PermissionService.hasPermission(Permission.BILL_EDIT);
        setNoEdit(editPermission);
        const addPermission = await PermissionService.hasPermission(Permission.BILL_ADD);
    setPermission(addPermission);
      }

    const onDateSelect = (value) => {
        setSelectedDate(new Date(value));
    }

    const updateDateValues = () => {
        let date = params?.bill_date;
        if (date) {
          setSelectedDate(new Date(date));
        }
      }
    const handleBilllingNameChange = (label) => {
        setBillingName(label)
    }
    const onNetAmountChange = (value) => {
        setNetAmount(value)
    };

    const createBill = async (values) => {
        const updateData = {

            invoice_number: values.invoice_number ? values.invoice_number : params?.invoice_number,

            net_amount : values.net_amount ? values.net_amount : params?.net_amount,

            date : selectedDate ,

            billing_name : values.billing_name ? values.billing_name.value : params ?. billing_name,

            account_id: values.accountName ? values.accountName.value : params?.accountName,

        }
        if (params) {
            await billService.update(params?.id, updateData, (err, response) => {
                if (response) {
                    navigation.navigate("Bills")
                }
            })
        } else {
            billService.create(updateData, (err, response) => {
                if (response && response.data) {
                    navigation.navigate("Bills")

                }
            })
        }


    }
    return (
        <Layout
            title={params ? `Bills#: ${params?.id}` : "Add Bill"}
            showBackIcon={true}
             FooterContent={activeTab === TabName.SUMMARY && (<SaveButton show={noEdit ? true : permission ? true : false}
                onPress={handleSubmit(values => { createBill(values) })}
            />)}
            buttonLabel={activeTab === TabName.ATTACHMENTS && "Upload"}
            buttonOnPress={()=>{takePicture()}}
        >
             {params && (
                <View style={styles.tabBar}>
                    <>
                        <Tab
                            title={TabName.SUMMARY}
                            isActive={activeTab === TabName.SUMMARY}
                            onPress={() => setActiveTab(TabName.SUMMARY)}
                        />
                          <Tab
                            title={TabName.ATTACHMENTS}
                            isActive={activeTab === TabName.ATTACHMENTS}
                            onPress={() => setActiveTab(TabName.ATTACHMENTS)}
                        />
                    </>
                </View>
            )}
            {activeTab === TabName.SUMMARY && (
            <ScrollView >
                <VerticalSpace10 />

                <AccountSelect
                    label="Account"
                    name="accountName"
                    options={vendorList}
                    required={true}
                    showBorder={true}
                    control={control}
                    onChange={(value) => setAccountName(value)}
                    data={accountName}
                    placeholder="Select Vendor"

                />
                <VerticalSpace10 paddingTop={5} />

                <Number
                    title="Vendor Invoice# "
                    name="invoice_number"
                    required={true}
                    control={control}
                    showBorder={true}
                />
                <VerticalSpace10 paddingTop={5} />
                <DatePicker
                    title="Invoice Date"
                    onDateSelect={onDateSelect}
                    selectedDate={new Date(params?.bill_date) ? selectedDate: selectedDate}
                />
                <VerticalSpace10 />

                <AddressSelect
                    label="Billing Name"
                    name="billing_name"
                    options={addressList}
                    showBorder={true}            
                    required={params?.billingName ? false : true}
                    onChange={handleBilllingNameChange}               
                    control={control}
                    data={params?.billing_name}
                    placeholder="Select Billing Name"
                />
                  <VerticalSpace10 paddingTop={5} />
                        <Currency
                            title="Net Amount"
                            name="net_amount"
                            control={control}
                            showBorder={true}
                            edit
                            required={netAmount ? false : true}
                            onInputChange={onNetAmountChange}
                            values={netAmount.toString()}
                        />
                        <VerticalSpace10 paddingTop={5} />

            </ScrollView>
            )}
             {activeTab === TabName.ATTACHMENTS && (
                <MediaList
                    mediaData={MediaData}
                    getMediaList={getMediaList}
                />
            )}
        </Layout>
    )
}
export default BillForm;
const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
})