const url = require("url");

function getUrlParameter(path, name) {
	const urlObject = url.parse(path);
	name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
	const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
	const results = regex.exec(urlObject.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export {
	getUrlParameter
};
