// Import React and Component
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import DatePicker from "../../components/DatePicker";
import SaleSettlementService from "../../services/SaleSettlementService";
import Currency from "../../components/Currency";
import CurrenCy from "../../lib/Currency";
import NextButton from "../../components/NextButton";
import ShiftSelect from "../../components/ShiftSelect";
import TextArea from "../../components/TextArea";
import VerticalSpace10 from "../../components/VerticleSpace10";
import DateTime from "../../lib/DateTime";
import asyncStorageService from "../../services/AsyncStorageService";


const SalesSettlementForm = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState();
  const [amountCash, setAmountCash] = useState();
  const [amountUpi, setAmountUpi] = useState();
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState();

  const navigation = useNavigation();

  const preloadedValues = {
    total_amount: totalAmount.toString(),
    amount_cash: amountCash,
    amount_upi: amountUpi

  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues,
  });

  const handleShiftOnChange = (selectedShift) => {
    setSelectedShift(selectedShift?.value)

  }

  const handleNotesOnChange = (value) => {
    setNotes(value)

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

  const addSales = async (values) => {

    let storeId = await asyncStorageService.getSelectedLocationId()

    let createData = new Object();

    createData.date = DateTime.formatDate(selectedDate)

    createData.storeId = storeId,

    createData.shift = selectedShift

    createData.total_amount = CurrenCy.Get(amountCash) + CurrenCy.Get(amountUpi)

    createData.amount_cash = amountCash

    createData.amount_upi = amountUpi

    createData.cash_in_store = values.cash_in_store

    createData.cash_to_office = values.cash_to_office

    createData.notes = notes

    createData.productCount = values.productCount

    SaleSettlementService.create(createData, (error, response) => {
      let id = response.data.id
      navigation.navigate("Media", { id: id, object: 'SALE_SETTLEMENT' })

    })
  }

  const onDateSelect = (value) => {
    //update the selected date
    setSelectedDate(new Date(value));
  }

  /* Render flat list funciton end */
  return (

    <Layout
      title="Add Sale Settlement"
      showBackIcon={true}
      backButtonNavigationUrl={"SalesSettlement"}
      FooterContent={<NextButton errors={errors}
        onPress={handleSubmit((values) => addSales(values))}
      />}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          <View style={{ marginTop: 10, padding: 10 }}>
            <View style={styles.container1}>
              <View style={styles.item}>
                <DatePicker
                  title="Date"
                  onDateSelect={onDateSelect}
                  selectedDate={selectedDate}
                  format={"DD-MMM-YYYY"}
                  disabled={false}
                />
              </View>
              <View style={{ paddingLeft: 8, width: "50%" }}>
                <ShiftSelect
                  onChange={handleShiftOnChange}
                  label={"Shift"}
                  name={"shift"}
                  control={control}
                  showBorder={true}
                  data={selectedShift}
                  placeholder={"Select Shift"}
                  required
                />
              </View>
            </View>
            <VerticalSpace10  />


            <View style={styles.container1}>

              <View style={styles.item}>

                <Currency
                  name="amount_cash"
                  title="Amount Cash"
                  control={control}
                  placeholder="Amount Cash"
                  onInputChange={onCashChange}
                  required={true}
                  edit

                />
              </View>

              <View style={{ paddingLeft: 8, width: "50%" }}>
                <Currency
                  name="amount_upi"
                  control={control}
                  title="Amount Upi"
                  placeholder="Amount Upi"
                  onInputChange={onUpiChange}
                  required
                  edit
                />
              </View>
            </View>
            <VerticalSpace10  />

            <Currency
              name="total_amount"
              control={control}
              title="Total Amount"
              placeholder="Total Amount"
              values={totalAmount.toString()}
              noEditable

            />
            <VerticalSpace10  />


            <Currency
              title="Cash In Store"
              name="cash_in_store"
              control={control}
              placeholder="Cash In store"
              required={true}
              edit
            />
            <VerticalSpace10  />

            <Currency
              title="Cash To Office"
              name="cash_to_office"
              control={control}
              placeholder="Cash To Office"
              required={true}
              edit
            />
            <VerticalSpace10  />

            <TextArea
              title={"Notes"}
              name="notes"
              placeholder="notes"
              control={control}
              onChange={handleNotesOnChange}
              value={notes}

            />


          </View>
        </View>
      </ScrollView>
    </Layout >
  );
};

export default SalesSettlementForm;

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
});
