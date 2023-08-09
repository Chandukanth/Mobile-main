import React from "react";
import SearchBar from ".";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from "react-native";
import { Color } from "../../helper/Color";

const Search = ({ searchPhrase, setSearchPhrase, setClicked, clicked, handleChange, openScanner, onPress, onEndEditing }) => {

    return (
        <>
            <View style={{ width: searchPhrase ? '100%' : '85%' }}>

                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    setClicked={setClicked}
                    onPress={onPress}
                    clicked={clicked}
                    handleChange={handleChange}
                    onEndEditing={onEndEditing}
                    noScanner
                />
            </View>

            {!searchPhrase && (
                <Icon name="barcode"
                    size={26}
                    color={Color.BLACK}
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '100%',
                        transform: [{ translateY: -45 }],
                    }}
                    onPress={() => openScanner()}

                />
            )}
        </>
    );
}

export default React.memo(Search);
