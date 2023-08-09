import React from "react";
import { View, StyleSheet, Text } from "react-native";

const Content = ({ content, modalcontent, modalcontent2 }) => {
    return (
        <>
            {content && (
                <View style={styles.content}>
                    {content}
                </View>
            )}
            <View style={{ flex: 1, }}>
                {modalcontent && (
                    <View style={{ flex: modalcontent && modalcontent2 ? 0.5 : 1, alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 30 }}>
                            {modalcontent}
                        </Text>
                    </View>
                )}
                {modalcontent2 && (
                    <View style={{ flex: modalcontent && modalcontent2 ? 0.5 : 1, alignItems: 'center' }}>
                            <Text style={{ color: "red", fontWeight: "bold", fontSize: 60 }}>{modalcontent2}</Text>
                    </View>
                )}
            </View>
        </>
    )
}
export default Content;
const styles = StyleSheet.create({
    content: {
        paddingRight: 15,
        paddingTop:15
    },
    
});