import React from 'react';
import { Color } from '../helper/Color';
import Button from './Button';

const SaveButton = (props) => {
    const show = props.show !== undefined ? props.show : true;

    if (!show) {
        return null; // Return null to not render anything if show is false
    }

    return (
        <Button title={"Save"} backgroundColor={Color.SAVE_BUTTON} errors={props.errors} onPress={props.onPress} />
    );
};

export default SaveButton;