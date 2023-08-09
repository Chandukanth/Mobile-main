import { LOGGLY_KEY } from "@env";
import { LogglyTracker } from "react-native-loggly-jslogger";
module.exports = {
    push: message => {
        const logger = new LogglyTracker();
        // set your key
        logger.push({ logglyKey: LOGGLY_KEY })
        //push a string
        logger.push(message);
    },
};
