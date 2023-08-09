
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { ErrorMessage } from "../helper/ErrorMessage";

class BrandService {


  async getBrandList(setBrandList) {
    try {
      apiClient.get(`${endpoints().brandAPI}/list?pagination=false`, (error, response) => {
        let Brand = new Array();
        let brandList = response?.data?.data;
        if (brandList && brandList.length > 0) {
          for (let i = 0; i < brandList.length; i++) {
            Brand.push({
              label: brandList[i].name,
              value: brandList[i].id,
            });
          }
        }
        // Set response in state
        setBrandList && setBrandList(Brand);
      })
    } catch (err) {
      console.log(err);
    }
  }

}
const brandService = new BrandService();

export default brandService;
