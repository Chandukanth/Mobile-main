import React, { useState } from "react";
import {
    StyleSheet,
    
} from "react-native";
import DatePicker from "../../components/DatePicker";
import Select from "../../components/Select";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import shiftService from "../../services/ShiftService";
import ShiftSelect  from "../../components/ShiftSelect";
import StoreSelect from "../../components/StoreSelect";
import UserSelect from "../../components/UserSelect";
import { ScrollView } from "react-native";
import storeService from "../../services/StoreService";
import orderService from "../../services/OrderService";
import VerticalSpace10 from "../../components/VerticleSpace10";
import StatusSelect from "../../components/StatusSelect";
import ObjectName from "../../helper/ObjectName";
import { useForm } from "react-hook-form";

const Gereral = (props) => {
    const { param, permission,setStatus,setSelectedUser,status,setSelectedStore,setSelectedShift,setSelectedDate ,selectedDate} = props
   
    const onDateSelect = async (value) => {
    
            setSelectedDate(new Date(value))
         }
    const handleShiftOnChange = (value) => {
        setSelectedShift(value.value)
    }
    const handleStoreOnChange = (value) => {

        setSelectedStore(value)
    }
 
    const handleStatusOnChange = (value) =>{
        setStatus(value.value)
    }
    const {
        control,
        formState: { errors },
    } = useForm({});

    return (
            <>
            <ScrollView >
                <DatePicker
                    title="Date"
                    onDateSelect={onDateSelect}
                    disabled={permission ? true : false}
                    selectedDate={selectedDate } 
                    showTime={true}
                    />
            
            <VerticalSpace10 paddingTop={5} />

                <ShiftSelect 
                    label={"Shift"}
                    data={param?.shiftId}
                    disableSearch
                    control={control}
                    disable={permission ? false : true}
                    showBorder={false}
                    divider
                    placeholder={"Select Shift"}
                    onChange={handleShiftOnChange}
                />
              <VerticalSpace10 paddingTop={5} />


            <StoreSelect
                onChange={handleStoreOnChange}
                label={"Location"}
                name={"Store"}
                placeholder={"Select Location"}
                showBorder={false}
                divider
                disable={permission ? false : true}
                data={param?.storeId ? parseInt(param?.storeId) : ""}
            />
              <VerticalSpace10 paddingTop={5} />

            
                <UserSelect
                    label="Store Executive"
                    onChange={(values) => setSelectedUser(values.value)}
                    divider
                    showBorder={false}
                    disable={permission ? false : true}
                    control={control}
                    selectedUserId={param?.sales_executive_user_id ? param?.sales_executive_user_id : ""}
                    placeholder="Select Location Executive"
                />
                 <VerticalSpace10 paddingTop={5} />
                <StatusSelect 
                 label={"Status"}
                 name="status"
                 control={control}
                 onChange={handleStatusOnChange}
                 placeholder={"Select Status"}
                 showBorder={false}
                 object={ObjectName.ORDER}
                 divider
                 data={param?.status_id ? parseInt(param?.status_id) : ""}
                 currentStatusId={param?.status_id }
                 disable ={param?.allow_edit == 1 ? false : true}
                />
                </ScrollView>
           </>
    )

}
export default Gereral;
const styles = StyleSheet.create({
    input: {
        color: "black",
        height: 50,
        width: "100%",
        padding: 10,
        borderColor: "#dadae8",
    },

});