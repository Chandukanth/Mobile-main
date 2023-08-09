// Import React and Component
import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Color } from "../../helper/Color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu } from 'react-native-material-menu';
import DropDownMenu from '../DropDownMenu';
import Icon from 'react-native-vector-icons/FontAwesome';
import Message from '../Message';
import Button from '../Button';
import settingService from '../../services/SettingService';
import Setting from '../../lib/Setting';


const ActionBar = ({
  title,
  buttonLabel,
  buttonLabel2,
  onPress,
  button2OnPress,
  showBackIcon,
  isKeyboardVisible,
  backButtonNavigationUrl,
  showScanner,
  openScanner,
  Add,
  showActionMenu,
  actionItems,
  updateValue,
  closeModal,
  ZunoMart,
  showFilter,
  onFilterPress,
  showMessage,
  params,
  showActionButton
}) => {

  const navigation = useNavigation();

  const [addVisible, setAddVisible] = useState(false);
  const [portalName,setPortalName] = useState("");

  const hideAddMenu = () => setAddVisible(false);

  const showAddMenu = () => {
    setAddVisible(true)
  };

  useEffect(()=>{
    getPortalName();
  },[])
  const showButton = showActionButton !== undefined ? showActionButton : true;

  const getPortalName =async ()=>{

   await settingService.get(Setting.PORTAL_NAME,(err,response)=>{
    if(response && response.settings && response.settings[0].value){
      setPortalName(response.settings[0].value)
    } 

  })

  
  }

  return (
    <>
      <View style={{
        flex: isKeyboardVisible ? 0.17 : 0.1,
        justifyContent: "center",
        backgroundColor: Color.ACTION_BAR_BACKGROUND,
      }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 10,
            backgroundColor: Color.ACTION_BAR_BACKGROUND,
          }}
        >
          <View style={{ flex: 0.1, paddingTop: 6 }}>
            {showBackIcon && (
              <TouchableOpacity
                onPress={() => {
                  if (updateValue) {
                    updateValue();
                  } else {
                    backButtonNavigationUrl ? navigation.navigate(backButtonNavigationUrl, params) : navigation.goBack();
                  }

                }}
                accessibilityLabel="menu"
              >
                <Ionicons
                  name="arrow-back"
                  size={35}
                  color={Color.INDIGO}
                />
              </TouchableOpacity>

            )}
          </View>
          {title && (
            <View style={{ flex: 0.60 }}>
              <Text style={{ fontSize: 20, color: Color.TITLE, paddingTop: 10, paddingLeft: 5 }} numberOfLines={1}>{title}</Text>
            </View>
          )}
          {ZunoMart && (
            <View style={{ flex: 0.60, paddingBottom: 1 }}>
              <Text style={{ color: Color.BLACK, fontWeight: "bold", fontSize: 20, paddingLeft: 5 }}>
                {portalName}
              </Text>
            </View>
          )}

          <View style={{ flex: buttonLabel ? 0.15 : 0.30, alignItems: "flex-end", justifyContent: "center" }}>

            {showScanner && (
              <View style={!buttonLabel ? { paddingRight: 25 } : {}}>
                <Icon name="barcode"
                  size={26}
                  color={Color.BLACK}
                  onPress={() => openScanner && openScanner()}

                />
              </View>
            )}
          </View>

          {showButton && buttonLabel && (
            <View style={{ flex: showActionMenu ? 0.4 : 0.3, alignItems: "center", justifyContent: "center", paddingTop: 6 }}>
              <Button title={buttonLabel} onPress={(e) => onPress(e)} backgroundColor={Color.SECONDARY_BUTTON} />
            </View>
          )}
          {buttonLabel2 && (
            <View style={{ flex: showActionMenu ? 0.3 : 0.3, alignItems: "center", justifyContent: "center" }}>
              <Button title={buttonLabel2} onPress={button2OnPress} color={Color.SECONDARY_BUTTON} />
            </View>
          )}

          {showActionMenu && (

            <DropDownMenu MenuItems={actionItems} onPress={closeModal} />

          )}

          {showFilter && (
            <View style={{ paddingRight: 25, marginTop: 5 }}>
              <Ionicons
                name="ios-filter-outline"
                size={35}
                color={Color.INDIGO}
                onPress={() => onFilterPress()}
              />
            </View>
          )}

          {Add && <Menu
            visible={addVisible}
            anchor={Add &&
              <TouchableOpacity onPress={showAddMenu} style={{ paddingHorizontal: 5 }}>
                <View style={{ flexDirection: 'row', color: '#FFF', backgroundColor: "#FFF", justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 7 }}>
                  <Text>
                    Add
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                </View>
              </TouchableOpacity>
            }
            onRequestClose={hideAddMenu}
          >
          </Menu>}
          {showMessage && (
            <Message />
          )
          }
        </View>
      </View>
    </>
  );
};
export default ActionBar;
