import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../../helper/Color";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "../../components/Card";
import Permission from "../../helper/Permission";
import PermissionService from "../../services/PermissionService";
import { useIsFocused } from "@react-navigation/native";
import QuickLinksIcon from "../../components/QuickLinksIcon";


const QuickLinks = ({ AddNewOrder, CheckIn, addNewTransfer }) => {

    const [orderViewPermission, setOrderViewPermission] = useState()
    const [transferViewPermission, setTransferViewPermission] = useState()
    const [attendanceCheckinCheckPermission, setAttendanceCheckinCheckPermission] = useState("")

    const focused = useIsFocused();


    useEffect(() => {
        getPermission();
    }, [focused])

    const getPermission = async () => {
        const isExist = await PermissionService.hasPermission(Permission.USER_MOBILE_CHECKIN);
        setAttendanceCheckinCheckPermission(isExist)
        const orderViewPermission = await PermissionService.hasPermission(Permission.ORDER_VIEW);
        setOrderViewPermission(orderViewPermission)
        const transferViewPermission = await PermissionService.hasPermission(Permission.TRANSFER_VIEW);
        setTransferViewPermission(transferViewPermission)
    }
    return (
        <View style={{ paddingTop: 10 }}>
            <Card
                title={"Quick Links"}
            >
                <View style={styles.bottomContainer}>
                    {orderViewPermission && (
                        <QuickLinksIcon
                            iconName="receipt"
                            label="New Order"
                            onPress={() => {
                                AddNewOrder();
                            }}
                        />
                    )}
                    {attendanceCheckinCheckPermission && (
                        <QuickLinksIcon
                            iconName="user"
                            label="   CheckIn"
                            onPress={() => {
                                CheckIn();
                            }}                        />
                    )}
                    {transferViewPermission && (
                        <QuickLinksIcon
                            iconName="truck-moving"
                            label=" New Transfer"
                            onPress={() => {
                                addNewTransfer();
                            }}                           />
                    )}
                </View>

            </Card>
        </View>
    )
}
export default QuickLinks;
const styles = StyleSheet.create({
  

    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
    },
   

});
