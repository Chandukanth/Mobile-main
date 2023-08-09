import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import { ErrorMessage } from "../helper/ErrorMessage";

class CategoryService {


  async getCategoryList(setCategoryList) {
    try {
      await apiClient.get(`${endpoints().categoryAPI}/list?pagination=false`,(error, response)=> {
        let category = new Array();
        let categoryList = response?.data?.data;
        if (categoryList && categoryList.length > 0) {
          for (let i = 0; i < categoryList.length; i++) {
            category.push({
              label: categoryList[i].name,
              value: categoryList[i].id,
            });
          }
        }
        // Set response in state
        setCategoryList && setCategoryList(category);
      })
    } catch (err) {
      console.log(err);
    }
  }

}
const categoryService = new CategoryService();

export default categoryService;
