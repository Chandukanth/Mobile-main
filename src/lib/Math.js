module.exports = {
	random: (x, y, uniqueNumbers) => {
		const number = Math.floor(Math.random() * (y - x + 1) + x);

		if (uniqueNumbers && uniqueNumbers.length > 0) {
			if (uniqueNumbers.indexOf(number.toString()) >= 0) {
				return this.random(x, y, uniqueNumbers);
			}
		} else {
			return number;
		}
		return number;
	},

	ceil: (value) => {
		const number = Math.ceil(value/7);
		return number;
	}
};