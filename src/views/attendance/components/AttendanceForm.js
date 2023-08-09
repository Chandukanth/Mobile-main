import React from "react";
import { View } from "react-native";
import Select from "../../../components/Select";
import DatePicker from "../../../components/DatePicker";
import TimePicker from "../../../components/TimePicker";
import { useForm } from "react-hook-form";
import UserSelect from "../../../components/UserSelect";
import ShiftSelect from "../../../components/ShiftSelect";
import StoreSelect from "../../../components/StoreSelect"

const AttendanceForm = (props) => {
  const {
    shiftList,
    userList,
    storeList,
    onUserChange,
    onStoreChange,
    onShiftChange,
    selectedUser,
    manageOther,
    selectedDate,
    selectedInTime,
    selectedOutTime,
    onInTimeChange,
    onOutTimeChange,
    onDateSelect,
    selectedStore,
    selectedShift,
  } = props;

  const {
    control,
    formState: { errors },
  } = useForm();

  return (
    <View style={{ flex: 1, justifyContent: "space-evenly", flexDirection: "column" }}>

      <DatePicker title="Date" onDateSelect={onDateSelect} selectedDate={selectedDate} format={"DD-MMM-YYYY"} disabled={manageOther} />

      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 0.49 }}>
          <TimePicker title="In Time" onTimeSelect={onInTimeChange} selectedTime={selectedInTime} placeholder={"Select InTime"} format={"hh:mm a"} disabled={manageOther} />
        </View>

        <View style={{ flex: 0.49 }}>
          <TimePicker title="Out Time" selectedTime={selectedOutTime} onTimeSelect={onOutTimeChange} placeholder={"Select OutTime"} format={"hh:mm a"} disabled={manageOther} />
        </View>
      </View>

      <UserSelect
        name={"user"}
        options={userList}
        label={"User"}
        selectedUserId={selectedUser.id}
        showBorder={true}
        disable={selectedUser && !manageOther ? true : false}
        placeholder={"Select User"}
        getDetails={onUserChange}
        control={control}
      />

      <StoreSelect
        name={"store"}
        options={storeList}
        data={selectedStore}
        label={"Location"}
        placeholder={"Select Location"}
        getDetails={onStoreChange}
        control={control}
      />

      <ShiftSelect
        name={"shift"}
        options={shiftList}
        label={"Shift"}
        data={selectedShift}
        placeholder={"Select Shift"}
        onChange={onShiftChange}
        control={control}
      />

    </View>
  );
};

export default AttendanceForm;
