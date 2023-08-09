import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from '../../../components/Modal';
import ProductCard from '../../../components/ProductCard';
import QuantityButton from "../../../components/Quantity/index";

const StatusUpdateModal = ({ toggle, modalVisible, title, confirmLabel, selectedProduct, ConfirmationAction, quantityOnChange }) => {

    const modalBody = (
        <View style={styles.modalBody}>
            {selectedProduct && (
                <>
                    <ProductCard
                        name={selectedProduct?.name}
                        brand={selectedProduct?.brand_name}
                        image={selectedProduct?.image}
                        sale_price={selectedProduct?.sale_price}
                        mrp={selectedProduct?.mrp}
                        noIcon
                    />

                    <View style={styles.quantity}>
                        <QuantityButton
                            quantityOnChange={quantityOnChange}
                            quantity={selectedProduct?.quantity}
                            disableControl={true}
                        />                    
                    </View>
                </>
            )}


        </View>
    )

    return (
        <>
            <Modal
                title={title}
                modalBody={modalBody}
                toggle={toggle}
                modalVisible={modalVisible}
                button1Label={confirmLabel}
                button1Press={ConfirmationAction}
            />
        </>
    )
}

export default StatusUpdateModal;


const styles = StyleSheet.create({
    modalBody: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    quantity: {
        alignItems: "center", 
        paddingVertical: 20
    },
});