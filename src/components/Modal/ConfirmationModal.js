import Modal from "../Modal";
import React from 'react';
import { Text,View, StyleSheet} from 'react-native';
import ProductCard from "../ProductCard";
import { Color } from "../../helper/Color";
import { verticalScale } from "../Metrics";
const ConfirmationModal = ({ toggle, modalVisible, title, description, confirmLabel, cancelLabel, scanProduct, ConfirmationAction, CancelAction }) => {

    const modalBody = (
        <View style={styles.modalBody}>
            <Text style={styles.bodyText}>{description}</Text>
            {scanProduct &&
                <ProductCard
                    name={scanProduct?.name}
                    brand={scanProduct?.brand_name}
                    image={scanProduct?.image}
                    sale_price={scanProduct?.sale_price}
                    mrp={scanProduct?.mrp}
                    noIcon
                />}
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
                button2Label={cancelLabel} 
                button2Press={()=>toggle()}
            />
        </>
    )
}

export default ConfirmationModal;


const styles = StyleSheet.create({
    modalHeader: {

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
        paddingVertical: 10,
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

    },
    bodyText : {
        paddingLeft : 60,
    }
});