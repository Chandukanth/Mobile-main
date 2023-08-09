import React, { useState, useEffect } from 'react';
import { Menu } from 'react-native-material-menu';
import { Ionicons } from '@expo/vector-icons';
import { Color } from '../helper/Color';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

const DropDownMenu = ({ MenuItems, onPress, icon, label, color }) => {
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  useEffect(() => {
    if (onPress) {
      hideMenu();
    }
  }, [onPress]);

  return (
    <>
      <Menu
        visible={visible}
        animationDuration={30}
        anchor={
          <TouchableOpacity onPress={showMenu}>
            <Ionicons
              name={icon ? icon : "ellipsis-vertical"}
              size={24}
              color={color ? color :Color.PRIMARY}
              style={{ paddingRight: 15, paddingTop: 8 }}
            />
            {label && (
              <Text style={{ color: Color.WHITE, fontSize:12 }}>{label}</Text>)}
          </TouchableOpacity>
        }
        onRequestClose={hideMenu}
      >
        <ScrollView style={{ maxHeight: 300 }}>
          {MenuItems &&
            MenuItems.length > 0 &&
            MenuItems.map((Item, index) => (
              <React.Fragment key={index}>{Item}</React.Fragment>
            ))}
        </ScrollView>
      </Menu>
    </>
  );
};

export default DropDownMenu;
