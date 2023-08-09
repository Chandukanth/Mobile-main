import React from 'react';

import { Modal, View, StyleSheet } from 'react-native';

import ModalHeader from './Modal/ModalHeader';

import ModalFooter from './Modal/ModalFooter';

function CoreModal({ modalVisible, toggle, title, modalBody, button1Label, button1Press, button2Label, button2Press }) {

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    toggle && toggle();
                }}>
                <View style={styles.modal}>
                    <View>

                        <View style={styles.modalContainer}>
                            <ModalHeader title={title} toggle={toggle} />
                            {modalBody}
                            <ModalFooter button1Label={button1Label} button1Press={button1Press} button2Label={button2Label} button2Press={button2Press} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default CoreModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: "#00000099",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: "#f9fafb",
        width: "80%",
        borderRadius: 5
    },
    modalHeader: {

    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        color: "#000"
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