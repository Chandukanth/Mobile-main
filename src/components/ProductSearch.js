import React from "react";

import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity
} from "react-native";

import ProductCard from "./ProductCard";

const SearchView = (props) => {
  const { searchResult, productOnClick } = props;
  return (
    <View>
      <FlatList
        data={searchResult}
        renderItem={({ item }) => (

          <ScrollView>
            <ProductCard
              item={item}
              image={item.image ? item.image : item.featured_media_url}
              name={item.product_name}
              sale_price={item.sale_price}
              mrp={item.mrp}
              size={item.size}
              unit={item.unit}
              brand={item.brand ? item.brand : item.brand_name}
              onPress={() => productOnClick(item)}
            />
            <View style={styles.divider} />
          </ScrollView>
        )}
      />
    </View>
  );
};

export default SearchView;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: "gray",
    height: 1
  },
});
