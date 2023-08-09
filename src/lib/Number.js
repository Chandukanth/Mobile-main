


class Number {

	static Get(number, defaultValue = null) {
		let formatData = number ? parseInt(number) : defaultValue;
		return formatData;
	}

	static quantityArray() {
		let array = [];
		for (let i = 1; i < 501; i++) {
			array.push({
				name: i,
				value: i,
			});
		}
		return array;
	}

	static GetFloat(number) {
		try {
			if (number) {

				let formatData = parseFloat(number);

				if (formatData) {

					let floatNumber = formatData.toFixed(2);

					return parseFloat(floatNumber);
				}
			}
			return null
		} catch (err) {
			console.log(err);
		}
	}

}

export default Number;