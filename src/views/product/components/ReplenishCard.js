
import { Card, Title, Paragraph, Badge } from 'react-native-paper';

import { Color } from "../../../helper/Color";

import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";

import QuantityButton from "../../../components/Quantity/index";

const ReplenishCard = ({ item, onReplenishHandler, quantityOnChange, onEditHandler }) => {

    return (
        <Card style={{ marginVertical: 5, borderColor: Color.LIGHT_DARK, borderWidth: 0.1 }}>
            <Card.Content>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 0.8 }}>
                        <Title style={{ fontSize: 18, color: Color.GREY }}>{item.locationName}</Title>
                    </View>

                    {item.replenishQuantity > 0 && item.updatedQuantity < item.min_quantity && (
                        <View style={{ flex: 0.2 }}>
                            <Badge size={39}> {item.replenishQuantity} </Badge>
                        </View>
                    )}
                </View>

                <Paragraph style={{ fontWeight: 'bold' }}>
                    <Text style={{ color: Color.ACTIVE }}>Available Quantity:  </Text>
                    {item.quantity == null ? (
                        <Text style={{ color: Color.RED, fontSize: 14 }}>No Stock Info</Text>
                    ) : (
                        <Text style={{ fontSize: 18, color: Color.ACTIVE }}>{item.quantity}</Text>
                    )}
                </Paragraph>

                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Paragraph style={{ fontWeight: 'bold' }}>
                            <Text style={{ color: Color.ACTIVE }}>Replenished Quantity:  </Text>
                            {item.replenishedQuantity > 0 ? (
                                <>
                                    <Text style={{ fontSize: 18, color: Color.ACTIVE }}>{item.replenishedQuantity} </Text>
                                    <Text style={{ color: Color.PRIMARY, fontSize: 12, }} onPress={() => onEditHandler(item)}>( EDIT )</Text>
                                </>
                            ) : (
                                <Text style={{ fontSize: 14, color: Color.RED }}>No info</Text>
                            )}
                        </Paragraph>
                    </View>
                </View>

                <Paragraph style={{ fontWeight: 'bold' }}>
                    <Text style={{ color: Color.ACTIVE }}>Order Quantity:  </Text>
                    {item.orderQuantity > 0 ? (
                        <Text style={{ fontSize: 18, color: Color.ACTIVE }}>{item.orderQuantity}</Text>
                    ) : (
                        <Text style={{ fontSize: 14, color: Color.RED }}>No info</Text>
                    )}
                </Paragraph>


                <Paragraph style={{ fontWeight: 'bold' }}>
                    <Text style={{ color: Color.ACTIVE }}>Last Stock Entry Date:  </Text>

                    {item.lastStockEntryDate ? (
                        <Text style={{ color: Color.ACTIVE }}>{item.lastStockEntryDate}</Text>
                    ) : (
                        <Text style={{ fontSize: 14, color: Color.RED }}>No info</Text>
                    )}
                </Paragraph>


                <Paragraph style={{ fontWeight: 'bold' }}>
                    <Text style={{ color: Color.ACTIVE }}>Last Order Date: </Text>

                    {item.lastOrderDate ? (
                        <Text style={{ color: Color.ACTIVE }}>{item.lastOrderDate}</Text>
                    ) : (
                        <Text style={{ fontSize: 14, color: Color.RED }}>No info</Text>
                    )}
                </Paragraph>


                {item.replenishQuantity > 0 && item.min_quantity > item.updatedQuantity && (
                    <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 0.7 }}>
                            <QuantityButton
                                quantityOnChange={(value) => quantityOnChange(value, item)}
                                quantity={item.replenishQuantity}
                                styleBtn={{ width: 50, height: 50, backgroundColor: Color.BLACK }}
                                styleTextInput={{ width: 50, height: 50 }}
                            />
                        </View>

                        <View style={{ flex: 0.4, justifyContent: "center" }}>
                            <Button title={"Replenish"} color={Color.PRIMARY} onPress={() => onReplenishHandler(item)} />
                        </View>
                    </View>
                )}

            </Card.Content>
        </Card>
    )
}

export default ReplenishCard;

const styles = StyleSheet.create({
    btnStyle: {
        color: '#FFF',
        borderColor: "red",
        borderWidth: 3,
        color: "black"
    },
});