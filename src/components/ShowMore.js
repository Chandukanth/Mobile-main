import React from "react";
import Spinner from "./Spinner";
import { View } from "react-native";
import LoadMoreButton from "./LoadMoreButton";

const ShowMore = ({List, isFetching, HasMore, onPress}) => {
    return (
        <>
            {List && List.length % 25 == 0 && List.length > 0 ?
                isFetching && HasMore ? (
                    <Spinner />
                ) : !HasMore ? (
                    ""
                ) : (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 10,
                        }}
                    >
                         
                        <LoadMoreButton title="Show More" onPress={onPress} />
                         

                    </View>
                ) : ""}
        </>
    )

}
export default ShowMore;