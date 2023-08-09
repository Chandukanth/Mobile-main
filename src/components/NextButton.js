import React from 'react';
import { Color } from '../helper/Color';
import Button from './Button';

const NextButton = (props) => {
    return (
        <Button title={"Next"} backgroundColor={Color.NEXT_BUTTON} errors={props.errors} onPress={props.onPress} />
    )
}

export default NextButton