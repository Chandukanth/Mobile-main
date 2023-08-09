import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import AlternativeColor from "../../components/AlternativeBackground";
import Label from "../../components/Label";
import NoRecordFound from "../../components/NoRecordFound";
import PhoneNumber from "../../components/PhoneNumberText";
import UserCard from "../../components/UserCard";
import IdText from "../../components/IdText";
import DateText from "../../components/DateText";
import DateTime from "../../lib/DateTime";
import { Color } from '../../helper/Color';


const VisitorCard = ({ visitorList }) => {
    const navigation = useNavigation()
    return (
        <>
            {visitorList && visitorList.length > 0 ? (
                visitorList.map((item, index) => {
                    const containerStyle = AlternativeColor.getBackgroundColor(index)

                    return (
                        <TouchableOpacity style={[styles.align, containerStyle]} onPress={() => navigation.navigate("Visitor/Form", { item })}
                        >
                            <View
                                style={{
                                    paddingHorizontal: 11,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {item?.media_url ? (
                                    <Image source={{ uri: item?.media_url }} style={{ width: 55, height: 55, borderRadius: 30 }} />
                                ) : (
                                    <UserCard
                                        size={55}
                                        showFullName={false}
                                        firstName={item.name}
                                        bgColor={Color.PRIMARY}
                                    />
                                )}

                            </View>
                            <View>
                                <Text>
                                    <IdText id={item?.id} />
                                    <DateText date={DateTime.formatedDate(item?.created_at)} />
                                </Text>
                                <Label text={item?.name} bold={true} size={14} />
                                <Text>{item?.purpose}</Text>
                                {item.company && (
                                    <Text>{item.company}</Text>
                                )}
                                {item.category && (
                                    <Text>{item?.category}
                                    </Text>
                                )}

                                <PhoneNumber phoneNumber={item?.phone} />
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <NoRecordFound iconName="receipt" styles={{ paddingVertical: 250, alignItems: "center" }} />
            )}
        </>
    )
}
export default VisitorCard
const styles = StyleSheet.create({

    align: {
        alignItems: "flex-start",
        paddingBottom: 10,
        paddingTop: 10,
    },
})