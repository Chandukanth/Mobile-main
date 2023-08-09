require('intl'); // import intl object
  require('intl/locale-data/jsonp/en-IN'); // load the required locale details

/**
 * Format currency in Indian format
 *
 * @param {*} price
 */

class Currency {
  
    static IndianFormat(amount) {
      const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      });
      let formattedValue = formatter.format(amount);
      formattedValue = formattedValue.replace(/\u00A0/g, '');
      return formattedValue;
    }
  
  
  static Get(price) {
    if (price !== null) {
      return parseFloat(price);
    } else {
      return "0.00";
    }
  }
}

export default Currency;

export function Decimal(data) {
  let price = data;
  let amount =
    price.indexOf(".") >= 0
      ? price.substr(0, price.indexOf(".")) +
      price.substr(price.indexOf("."), 3)
      : price;
  return amount;
}

export function Percentage(data) {
  let price = data;
  if (price) {
    return `${price}%`;
  } else {
    return "0%";
  }
}
