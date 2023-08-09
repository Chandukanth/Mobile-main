import React, { useState } from 'react';
import Modal from "../../components/Modal"
import Number from '../../components/Number';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

const CustomerInfoModal = ({ toggle, modalVisible, title,  confirmLabel, cancelLabel,ids , locationName, shiftName,userName ,selectedUser,selectedShift}) => {
    const [number, setNumber] = useState()
    const navigation = useNavigation();


    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
    });
    const onNumberChange = (value) => {
        setNumber(value)
    };

    const Next = () => {
        toggle()
        if (!ids) {
          navigation.navigate("List", {
            newOrder: true,
          });
        } else if (number) {
          navigation.navigate("Order/ProductList", { storeId: ids, locationName: locationName, shift: shiftName, salesExecutive: userName, userId: selectedUser, shiftId: selectedShift, isNewOrder: true, customer_phone_number: number });
        } else {
          navigation.navigate("Order/ProductList", { storeId: ids, locationName: locationName, shift: shiftName, salesExecutive: userName, userId: selectedUser, shiftId: selectedShift, isNewOrder: true });
    
        }
    
      }

    const modalBody = (
       
            <Number
                name="customer_phone_number"
                title="Cusomer Phone Number"
                control={control}
                placeholder="Phone Number"
                onInputChange={onNumberChange}
            />

        
    )
    return (
        <>
            <Modal
                title={title}
                modalBody={modalBody}
                toggle={toggle}
                modalVisible={modalVisible}
                button1Label={confirmLabel}
                button1Press={Next}
                button2Label={cancelLabel}
                button2Press={Next}
            />
        </>
    )
}

export default CustomerInfoModal;


