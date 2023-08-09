import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "../../components/Card";
import dashboardService from "../../services/DashboardService";
import { Color } from "../../helper/Color";
import { useIsFocused } from "@react-navigation/native";
import Currency from "../../lib/Currency";
import Link from "../../components/Link";
import { useNavigation } from "@react-navigation/native";
import Label from "../../components/Label";


const OrderCard = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const navigation = useNavigation()

    const isFocused = useIsFocused()

    useEffect(() => {
        getOrderDetail();
    }, [isFocused])

    const getOrderDetail = async () => {
        await dashboardService.getOrder(setTotalAmount)
    };

    return (
        <View style={styles.order}>

            <Card
                title="Order"
                viewAllHander={() => navigation.navigate("Order")}
                showViewAll
            >
                
        
                <View style={styles.orderContainer}>
                    <View style={styles.orderRow}>
                        <Text style={styles.label}>Current Month Total Amount : </Text>
                        <View style={{ paddingTop: 10 }} >
                            <Label text={Currency.IndianFormat(totalAmount ? totalAmount : 0)} bold={true} />
                        </View>
                    </View>
                </View >
            </Card >

        </View >
    )

}
export default OrderCard;
const styles = StyleSheet.create({

    orderContainer: {
        flexDirection: 'row',
        justifyContent: "flex-start",
    },
    orderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 7
    },
    label: {
        fontSize: 15,
        marginTop: 5,
        justifyContent: "flex-start",

    },
    order: {
        paddingTop: 10,
        paddingBottom: 10
    }
});
