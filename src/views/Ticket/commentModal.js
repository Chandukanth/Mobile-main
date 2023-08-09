import Modal from "../../components/Modal";
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Color } from "../../helper/Color";
import { verticalScale } from "../../components/Metrics";
import TextArea from "../../components/TextArea";

const CommentModal = ({ toggle, modalVisible, title, values, confirmLabel, cancelLabel, control, ConfirmationAction, onChange }) => {

    const modalBody = (
        <View style={styles.modalBody}>
            <TextArea
                title={"Comments"}
                name={"comment"}
                values={values && values.toString()}
                required={true}
                control={control}
                onInputChange={onChange}
                placeholder="Comment"
            />
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
                button2Press={() => toggle()}
            />
        </>
    )
}

export default CommentModal;


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
    bodyText: {
        paddingLeft: 60,
    }
});