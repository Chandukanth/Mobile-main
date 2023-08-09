

class String {

    static concatName(firstName, lastName) {
        let fullName;
        if (firstName && lastName) {
            fullName = firstName + " " + lastName;
        } else if (firstName) {
            fullName = firstName
        } else if (lastName) {
            fullName = lastName
        }

        return fullName;
    }

    static ReplaceSpaceDashSymbol(string) {
        if (string) {
            let str = string.replace(/\s+/g, '-').toLowerCase();
            return str;
        }
        return null;
    }


    static convertPropertiesToJSON(obj) {

        for (var prop in obj) {

            if (obj.hasOwnProperty(prop) && obj[prop] && obj[prop].value) {

                if (typeof obj[prop] === "object") {
                    obj[prop] = JSON.stringify(obj[prop]);
                }
            }
        }

        return obj;
    }
}

export default String;