class ObjectLib {
    
    // To avoid the TimeZone issue with toISOString()
    static getKeyValue(object) {
        if (object) {
            let keys = new Array();

            let values = new Array();

            let createPlaceHolder = new Array();

            let updatePlaceHolder = new Array();

            //loop the objects
            Object.keys(object).forEach(key => {
                if (object[key]) {
                    values.push(object[key]);
                } else {
                    values.push(null);
                }

                keys.push(key);
                createPlaceHolder.push('? ');
                updatePlaceHolder.push(`${key} = ?`)
            });

            //get the key string
            var keyString = keys.join(', ');

            //get the value string
            let valueString = values.join(', ');

            let createPlaceHolderString = createPlaceHolder.join(', ');

            let updatePlaceHolderString = updatePlaceHolder.join(', ');


            return {
                keyString,
                keyArray: keyString,
                valueString,
                valuesArrray: values,
                createPlaceHolderArray: createPlaceHolder,
                createPlaceHolderString: createPlaceHolderString,
                updatePlaceHolderArray: updatePlaceHolderString,
                updatePlaceHolder: updatePlaceHolderString
            }
        }
    }
}

export default ObjectLib;
