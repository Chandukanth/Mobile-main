import React from 'react';
import { Button } from 'react-native-paper';
import { Color } from '../helper/Color';

const CheckInButton = (props) => {
    return (
        <Button uppercase={false} style={{backgroundColor:Color.GREEN}} color={Color.WHITE} onPress={props.onPress}>Check-In Now</Button>
    )
}

export default CheckInButton