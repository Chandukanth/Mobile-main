import {
    RefreshControl
} from "react-native";

const PullDownRefreshControl = ({refreshing , onRefresh}) => {


    return (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    )
}

export default PullDownRefreshControl;

