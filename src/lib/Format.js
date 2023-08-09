function getFullName(firstName, lastName) {
	if (firstName !== undefined && lastName !== undefined) {
		return `${firstName} ${lastName}`;
	} else if (firstName !== undefined) {
		return firstName;
	} else if (lastName !== undefined) {
		return lastName;
	}
}

export {
	getFullName
};
