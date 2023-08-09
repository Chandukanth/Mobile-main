
class Url {
    static get(url, params) {

        let queryString = [];
        if (params) {
                      for (let key in params) {
                        queryString.push(`${key}=${params[key]}`);
                      }
                    }
        
            if (queryString && queryString.length > 0) {
              url = `${url}?${queryString.join("&")}`;
            } else {
              url = `${url}`;
            }
            return url;
          }
}
export default Url
