
import { Card, Title, Paragraph, Badge } from 'react-native-paper';

import { Color } from "../../../helper/Color";

import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";

import QuantityButton from "../../../components/Quantity/index";

//ProductCard UI
import ProductCard from "../../../components/ProductCard";

const ReplenishCard = ({ item, quantityOnChange, onEditHandler, onReplenishHandler, navigation }) => {
    return (
        <Card style={{ marginVertical: 5, borderColor: '#333', borderWidth: 0.1 }}>
            <Card.Content>

                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 0.8 }}>
                        <ProductCard
                            noIcon
                            onPress={() => {
                                navigation.navigate("Products/Details", {
                                    productId: item.id,
                                    name: item.name,
                                    product_name: item.product_name,
                                    quantity: item.quantity,
                                    brand: item.brand,
                                    status: item.status,
                                    brand_id: item.brand_id,
                                    image: item.image,
                                    category_id: item.category_id,
                                    category: item.category,
                                    size: item.size,
                                    unit: item.unit,
                                    mrp: item.mrp,
                                    sale_price: item.sale_price,
                                    barcode: item.barcode,
                                    printName: item.print_name
                                });
                            }}
                            size={item.size}
                            unit={item.unit}
                            name={item.name}
                            image={item.image}
                            brand={item.brand}
                            sale_price={item.sale_price}
                            mrp={item.mrp}
                        />
                    </View>
                    
                    {item.updatedQuantity < item.min_quantity && (
                        <View style={{ flex: 0.2 }}>
                            <Badge size={39}>{item.quantity}</Badge>
                        </View>
                    )}
                </View>

                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                    <Paragraph style={{ fontWeight: 'bold', color: Color.ACTIVE }}>Store: {item.locationName}</Paragraph>
                </View>

                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                    <Paragraph style={{ fontWeight: 'bold', color: Color.ACTIVE }}>Date: {item.orderDate}</Paragraph>
                </View>

                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Paragraph style={{ fontWeight: 'bold' }}>
                            <Text style={{ color: Color.ACTIVE }}>Replenish Quantity:  </Text>
                            {item.replenishQuantity > 0 ? (
                                <>
                                    <Text style={{ fontSize: 18, color: Color.ACTIVE }}>{item.replenishQuantity} </Text>
                                    <Text style={{ color: Color.PRIMARY, fontSize: 12, }} onPress={() => onEditHandler(item)}>( EDIT )</Text>
                                </>
                            ) : (
                                <Text style={{ fontSize: 14, color: Color.RED }}>No info</Text>
                            )}
                        </Paragraph>
                    </View>
                </View>

                {!item.replenishQuantity && (
                    <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                        <View style={{ flex: 0.7 }}>
                            <QuantityButton
                                quantityOnChange={(value) => quantityOnChange(value, item)}
                                quantity={item.quantity}
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