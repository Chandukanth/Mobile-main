const dateTime = require("./DateTime");
import { LOG_LEVEL } from "@env";
module.exports = {
	debug: (message) => {
		if (LOG_LEVEL === "DEBUG") {
			console.log(`[${dateTime.format(new Date(), "MMM Do, YYYY hh:mm A")}] ${message}`);
		}
	}
};
