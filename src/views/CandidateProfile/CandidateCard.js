import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../../helper/Color";
import NoRecordFound from "../../components/NoRecordFound";
import UserAvatar from "../../components/UserCard"
import { useNavigation } from "@react-navigation/native";

const CandidateCard = ({ candidateList }) => {
    const navigation = useNavigation()
    return (
        <>
            {candidateList && candidateList.length > 0 ? (
                candidateList.map((item) => {
                    return (
                        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CandidateProfile/Form", { item })}
                        >
                            <View style={{ flex: 0 }}>
                                <View
                                    style={{
                                        paddingHorizontal: 11,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingVertical: "10%"
                                    }}
                                >
                                    <UserAvatar
                                        size={55}
                                        showFullName={false}
                                        firstName={item.firstName}                                        src={item.media_url}
                                        bgColor={Color.PRIMARY}
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    justifyContent: "space-between",
                                    paddingVertical: 5,
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{ fontWeight: 'bold', textTransform: "capitalize" }}
                                >
                                    {item.firstName + " " + item.lastName}
                                </Text>
                                <Text>{item?.positionType}
                                </Text>
                                <View >
                                    <Text>{item?.phone}</Text>
                                </View>
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
export default CandidateCard

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        height: 60,
        backgroundColor: "#fff",
        borderColor: "#fff",
        paddingHorizontal: 10,
        elevation: 5,
    },
    card: {
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: Color.WHITE,
        elevation: 8,
        marginTop: 13,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 2,
        alignItems: "center",
        justifyContent: "space-between",
    },
    cartText: {
        width: "90%",
        fontSize: 16,
        fontWeight: "600",
        textTransform: "capitalize",
        color: "black",
    },


});