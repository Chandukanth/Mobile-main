import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View, StyleSheet } from "react-native";
import Layout from "../../components/Layout";
import SaveButton from "../../components/SaveButton";
import { ScrollView } from "react-native";
import Currency from "../../components/Currency";
import DatePicker from "../../components/DatePicker";
import PaymentAccountSelect from "../../components/PaymentAccountSelect";
import Select from "../../components/Select";
import VerticalSpace10 from "../../components/VerticleSpace10";
import accountService from "../../services/AccountService";
import PaymentService from "../../services/PaymentService";
import UserSelect from "../../components/UserSelect";
import Tab from "../../components/Tab";
import TabName from '../../helper/Tab';
import MediaList from "../../components/MediaList";
import mediaService from '../../services/MediaService';
import Media from '../../helper/Media';
import ObjectName from "../../helper/ObjectName";
import NextButton from "../../components/NextButton"



const PaymentForm = (props) => {
    const params = props?.route?.params?.item
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [accountList, setAccountList] = useState([]);
    const [amount, setAmount] = useState(params?.amount || "")
    const [activeTab, setActiveTab] = useState(TabName.GENERAL);
    const [MediaData, setMediaData] = useState([]);
    const [id, setId] = useState("")


    const preloadedValues = {
        amount: params && parseInt(params?.amount),
        account: params?.accountId,
        payment_account: params?.paymentAccountId
    }
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });

    useEffect(() => {
        let mount = true
        mount && accountService.GetList(null, (callback) => { setAccountList(callback) })
        mount && getMediaList()
        return () => {
            mount = false
        }
    }, [])



    const onDateSelect = (value) => {
        setSelectedDate(new Date(value));
    }

    const addPayment = async (values) => {
        let createData = {
            date: selectedDate,
            amount: values.amount,
            account: values.account.value,
            payment_account: values.payment_account.value,
        }
        if (params) {
            await PaymentService.update(params?.id, createData, (err, response) => {
                if (response) {
                    props.navigation.navigate("Payments")
                }
            })
        } else {
            await PaymentService.create(createData, (err, response) => {
                if (response) {
                    setId(response.data.id)
                    setActiveTab(TabName.ATTACHMENTS)
                }
            })
        }

    }
    const takePicture = async (e) => {
        const image = await Media.getImage();
        if (image && image.assets) {
            const response = await fetch(image.assets[0].uri);
            const blob = await response.blob();
            await Media.uploadImage(id ? id : params?.id, blob, image.assets[0].uri, ObjectName.PAYMENT, null, null, async (response) => {
                if (response) {
                    getMediaList();
                }
            })
        }
    };


    const getMediaList = async () => {
        await mediaService.search(id ? id : params?.id, ObjectName.PAYMENT, (callback) => setMediaData(callback.data.data))
    }

    return (
        <Layout
            title={params ? "Payment Detail" : " Add Payment "}
            showBackIcon
            buttonLabel={activeTab === TabName.ATTACHMENTS && "Upload"}
            buttonOnPress={() => takePicture()}
            FooterContent={activeTab === TabName.GENERAL ? <SaveButton errors={errors} onPress={handleSubmit(values => { addPayment(values) })} />
                : <NextButton onPress={() => props.navigation.navigate("Payments")} />
            }
        >
            {params &&
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
            }

            <ScrollView>
                {activeTab === TabName.GENERAL && (
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <DatePicker
                            title="Date"
                            onDateSelect={onDateSelect}
                            selectedDate={selectedDate}
                        />
                        <VerticalSpace10  />
                        {!params && (
                            <>
                                <PaymentAccountSelect
                                    control={control}
                                    required={true}
                                    name="payment_account"
                                    label="Payment Account"
                                    placeholder={"Select Payment Account"}
                                />
                                <VerticalSpace10  />
                                <Select
                                    control={control}
                                    required={true}
                                    options={accountList}
                                    name="account"
                                    label="Account"
                                    placeholder={"Select Account"}
                                />
                                <VerticalSpace10  />
                            </>
                        )}
                        <Currency
                            name="amount"
                            title={"Amount"}
                            control={control}
                            edit
                            onInputChange={(values) => setAmount(values)}
                            values={amount}
                            placeholder="Amount" />
                        {params && (
                            <>
                                <VerticalSpace10  />

                                <UserSelect
                                    label="Owner"
                                    disable={true}
                                    selectedUserId={params?.owner_id}
                                    control={control}


                                />
                            </>
                        )}

                    </View>
                )}
                {activeTab === TabName.ATTACHMENTS && (
                    <MediaList
                        mediaData={MediaData}
                        getMediaList={getMediaList}
                    />
                )}
            </ScrollView>
        </Layout>
    )

}
export default PaymentForm
const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
});
