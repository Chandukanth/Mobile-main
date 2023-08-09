

import React, { useEffect, useState, useCallback } from "react";
import Name from "../../components/Name";
import Layout from "../../components/Layout";
import DatePicker from "../../components/DatePicker";
import PhoneNumber from "../../components/PhoneNumber";
import { useForm } from "react-hook-form";
import TextInput from "../../components/TextInput";
import { ScrollView, Text, View } from "react-native";
import DoneButton from "../../components/DoneButton";
import VerticalSpace10 from "../../components/VerticleSpace10";
import Email from "../../components/Email";
import Password from "../../components/Password";
import UserRoleSelect from "../../components/UserRoleSelect";
import userService from "../../services/UserService";
import DateTime from "../../lib/DateTime";
import Select from "../../components/Select";
import { userType } from "../../components/UserType";
import { useNavigation } from "@react-navigation/native";


const UserForm = (props) => {
    const params = props?.route?.params?.item
    let id = params?.id

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [phoneNumber, setPhoneNumber] = useState(params?.mobileNumber || "")
    const [role, setRole] = useState("")
    const [type, setType] = useState("")

    const navigation = useNavigation();



    const preloadedValues = {
        id: params?.id,
        email: params?.email,
        firstName: params?.firstName,
        lastName: params?.lastName ? params?.lastName : "",
        mobileNumber: params?.mobileNumber,
        data: selectedDate,
        role: role,
        type: type,

    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: preloadedValues
    });
    const onDateSelect = (value) => {
        setSelectedDate(new Date(value));
    }
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value)
    }

    const handleTypeChange = (value) => {
        setType(value)
    }

    const createUser = async (values) => {
        const updateData = {
            first_name: values.firstName ? values.firstName : params?.firstName,

            last_name: values.lastName ? values.lastName : params?.lastName,

            date: DateTime.formatDate(selectedDate),

            role: role ? role : params?.role,

            mobileNumber: values.phoneNumber ? values.phoneNumber : params?.phoneNumber,

            password: values.password ? values.password : params?.password,

            type: type ? type : params?.type,

            email: values.email ? values.email : "",

            mobileNumber1: values.phoneNumber ? values.phoneNumber : params?.phoneNumber,

            roleId: role.value ? role.value : params?.role,

            user_type : type.value ? type.value : params?.type,

        }
        if (params) {
            await userService.update(params?.id, updateData, (err, response) => {
                if (response) {
                    navigation.navigate("Users")
                }
            })
        } else {
            userService.create(updateData, (err, response) => {
                if (response && response.data) {
                    navigation.navigate("Users")

                }
            })
        }


    }
    return (
        <Layout
            title={params ? `User#: ${params?.id}` : "Add User"}
            showBackIcon={true}
            FooterContent={<DoneButton
                onPress={handleSubmit(values => { createUser(values) })}
            />}

        >
            <ScrollView >
                <VerticalSpace10  />

                <Name
                    title={"First Name"}
                    name="firstName"
                    control={control}
                    required={true}

                />
                <VerticalSpace10  />

                <Name
                    title={"Last Name"}
                    name="lastName"
                    control={control}

                />
                <VerticalSpace10  />
                <Email
                    title={"Email"}
                    name="email"
                    control={control}
                />
                <VerticalSpace10  />
                <PhoneNumber
                    title="Phone Number"
                    name="phoneNumber"
                    control={control}
                    values={phoneNumber}
                    onInputChange={handlePhoneNumberChange}
                />
                <VerticalSpace10  />

                {!params && (
                    <>
                    <Password
                        title={"Password"}
                        name="password"
                        control={control}
                        required={true}

                    />

                    <VerticalSpace10  />
                    </>
                )}
                <Select
                    name="type"
                    label="Type"
                    placeholder="Select User Type"
                    control={control}
                    getDetails={handleTypeChange}
                    data={params?.type}
                    showBorder={true}
                    options={userType}
                    required={true}
                />
                <VerticalSpace10  />

                <UserRoleSelect
                    control={control}
                    label="Role"
                    name={"role"}
                    placeholder={"Select Role"}
                    onChange={(value) => { setRole(value) }}
                    required={true}
                    data={params?.role_id}

                />
                <VerticalSpace10  />
                {!params && (
                    <DatePicker
                        title="Date of joining"
                        onDateSelect={onDateSelect}
                        selectedDate={selectedDate}
                    />
                )}
                <VerticalSpace10  />

            </ScrollView>

        </Layout>
    )

}
export default UserForm;