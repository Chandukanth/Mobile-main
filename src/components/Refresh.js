import React, { useCallback } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

const Refresh = ({ children, refreshing, setRefreshing }) => {
    const wait = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
    }, []);
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
        >
            <View>
            {children}
            </View>
        </ScrollView>
    )

}
export default Refresh;