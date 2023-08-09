import Modal from "../Modal";
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import Select from "../Select";
import { Color } from "../../helper/Color";
import { verticalScale } from "../Metrics";
import { useForm } from "react-hook-form";

const ConfirmationModal = ({ toggle, modalVisible, ConfirmationAction, Numbers, onChange }) => {

    const [options, setOption] = useState([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
    });

    useEffect(() => {
        getOption();
    }, []);

    const getOption = () => {
        let numberOfOption = Numbers ? Numbers : 50;
        let options = new Array();
        for (let i = 1; i <= numberOfOption; i++) {
            options.push({
                label: `${i}`,
                value: `${i}`
            });
        }
        setOption(options);
    }



    const modalBody = (
        <View style={styles.modalBody}>
            <Select
                label={"Number Of Copies"}
                name={"numberOfCopies"}
                options={options}
                control={control}
                getDetails={(value) => onChange(value)}
                placeholder="Number Of Copies"
                required={true}
                disableSearch
            />

        </View>
    )

    return (
        <>
            <Modal
                title={"Number Of Copies"}
                modalBody={modalBody}
                toggle={toggle}
                modalVisible={modalVisible}
                button1Label={"Print"}
                button1Press={ConfirmationAction}
                button2Label={"Cancel"}
                button2Press={()=>toggle()}
            />
        </>
    )
}

export default ConfirmationModal;


const styles = StyleSheet.create({
    modalHeader: {
        width: 300
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        color: Color.BLACK
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    modalBody: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    modalFooter: {
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        height: verticalScale(40),
        backgroundColor: "#fff"
    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    actionText: {
        color: "#fff"

    }
});