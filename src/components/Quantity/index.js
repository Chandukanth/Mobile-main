import React from 'react';
import { View, TextInput } from 'react-native';
import styles from './style';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import { Color } from '../../helper/Color';

const RnIncrementDecrementBtn = ({
  val,
  minVal,
  max,
  disableControl,
  minreq,
  handleClick,
  styleTextInput,
  styleBtn,
  disabledColor,
  activeColor,
  labelStyle,
  quantity,
  quantityOnChange,
  item
}) => {

  const [value, changeValue] = React.useState(quantity);
  const [count, changeCount] = React.useState(100);
  const [minReq, addMinReq] = React.useState(0);
  const [min, addMinValue] = React.useState(0);
  const [leftBtnDisable, changeLeftBtnDisable] = React.useState(false);
  const [rightBtnDisable, changeRightBtnDisable] = React.useState(false);
  const [disableColorBtn, addDisableColor] = React.useState('#eeeeee');
  const [activeColorBtn, addActiveColor] = React.useState('#00aeef');

  React.useEffect(() => {
    changeValue(quantity ? quantity : 0);
  }, [quantity])

  React.useEffect(() => {
    if (val) {
      changeValue(val);
    }
    if (max) {
      changeLeftBtnDisable(max <= 0);
      changeCount(max - 0);
    }
    if (minreq) {
      addMinReq(minreq);
    }
    if (val && max) {
      changeCount(max - val);

      changeRightBtnDisable(val <= 0);
    }
    if (minVal) {
      changeRightBtnDisable(value <= minVal);
      addMinValue(minVal);
    }
    if (disabledColor) {
      addDisableColor(disabledColor);
    }
    if (activeColor) {
      addActiveColor(activeColor);
    }
  }, [val, max, minreq, minVal, disabledColor, activeColor]);

  // function to handle btn click
  const handlePress = val => {
    handleClick ? handleClick(val) : {};
  };

  const handleQuantityFieldOnChange = (e) => {
    let quantity = e.nativeEvent.text;
    quantity = quantity ? parseInt(quantity) : 0;
    if (quantity != "") {
      changeValue(quantity);
      quantityOnChange(quantity);
    } else {
      changeValue(0);
      quantityOnChange(0);
    }
  }

  return (
    <View style={styles.viewOuter}>
      <View
        style={[
          styles.viewBtnLeft,
          {
            backgroundColor:
              Color.PRIMARY
          },
          styleBtn,
        ]}>

        <Button
          labelStyle={labelStyle ? labelStyle : styles.labelStyle}
          disabled={rightBtnDisable || disableControl}
          color={'#ffffff'}
          onPress={() => {
            // changeDisable(true);
            if (value - 1 <= min || value - 1 < minReq) {
              changeLeftBtnDisable(false);
              changeRightBtnDisable(true);
              if (value - 1 <= min) {
                changeValue(value - 1);
                changeCount(count + 1);
                handlePress(value - 1);
                quantityOnChange(value - 1, item);
              }
              if (value - 1 < minReq) {
                changeCount(count + minReq);
                changeValue(0);
                handlePress(0);
                quantityOnChange(0, item);
              }
            } else {
              changeLeftBtnDisable(false);
              changeCount(count + 1);
              changeValue(value - 1);
              handlePress(value - 1);
              quantityOnChange(value - 1, item);
            }
          }}>
          -
        </Button>


      </View>
      <View style={[styles.viewTextInput, styleTextInput]}>
        <Formik
          initialValues={{ quantity: value ? value.toString() : "0" }}
          enableReinitialize={true}
        >
          {({ values }) => (
            <>
              <TextInput
                style={{ alignItems: "center", justifyContent: "center" }}
                name="quantity"
                textAlign={'center'}
                value={values.quantity}
                keyboardType='number-pad'
                onChange={(value) => handleQuantityFieldOnChange(value)}
                disabled={true}
                editable={!disableControl}
              />
            </>
          )}
        </Formik>
      </View>
      <View
        style={[
          styles.viewBtnRight,
          {
            backgroundColor: Color.PRIMARY
          },
          styleBtn,
        ]}>
        <Button
          labelStyle={labelStyle ? labelStyle : styles.labelStyle}
          disabled={leftBtnDisable || disableControl}
          color={'#ffffff'}
          onPress={() => {
            if (count - 1 <= 0) {
              changeCount(0);
              changeRightBtnDisable(false);
              changeLeftBtnDisable(true);
              changeValue(value + 1);
              quantityOnChange(value + 1, item);
            } else {
              if (value < minReq) {
                changeCount(count - minReq);
                changeValue(value + minReq);
                handlePress(value + minReq);
                quantityOnChange(value + minReq, item);
              } else {
                changeCount(count - 1);
                changeValue(value + 1);
                handlePress(value + 1);
                quantityOnChange(value + 1, item);
              }
              changeRightBtnDisable(false);
            }
          }}>
          +
        </Button>
      </View>
    </View>
  );
};

export default RnIncrementDecrementBtn;