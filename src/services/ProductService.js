
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import Toast from 'react-native-simple-toast';

import SQLLiteDB from "../lib/SQLLiteDB";
import { ErrorMessage } from "../helper/ErrorMessage";
import ObjectLib from "../lib/Object";
import AlertModal from "../components/Alert";
import Numbers from "../lib/Number";
import systemLogService from "./SystemLogService";
import ObjectName from "../helper/ObjectName";
import asyncStorageService from "./AsyncStorageService";
import Url from "../lib/Url";

class ProductService {

    async addProduct(navigation, bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().productAPI}`, bodyData, (error, res) => {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }


    async updateProduct(navigation, bodyData, productId, callback) {
        try {
            if (bodyData && productId) {


                apiClient.put(`${endpoints().productAPI}/${productId}`, bodyData, (error, res) => {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }
    async search(navigation, params, callback) {
        try {


            const queryString = [];

            let apiUrl = `${endpoints().productAPI}/search`

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString.length > 0) {
                apiUrl = `${apiUrl}?${queryString.join("&")}`;
            }

            let productList = new Array();

            apiClient.get(apiUrl, (error, res) => {
                if (res && res.data && res.data.data) {
                    productList = res.data.data;
                }
                return callback(null, productList);

            })

        } catch (err) {
            Toast.show(err.message, Toast.LONG);
            console.log(err);
            return callback(err, []);
        }
    }

    async searcByBarcodeFromLocalDB(searchString) {

        try {
            const products = await SQLLiteDB.runQuery(SQLLiteDB.DB, `SELECT * FROM product_index WHERE barcode='${searchString}' OR product_id='${searchString}'`);
            return products
        } catch (err) {
            console.log(err);
        }
    }

    async searchProductbyBarCodeInProductPrice(barCode) {

        try {
            const products = await SQLLiteDB.runQuery(SQLLiteDB.DB, `SELECT * FROM product_price WHERE barcode=${barCode}`);
            return products
        } catch (err) {
            console.log(err);
        }
    }

    async searchProductByProductId(productId) {

        try {
            const products = await SQLLiteDB.runQuery(SQLLiteDB.DB, `SELECT * FROM product_index WHERE product_id=${productId}`);
            return products
        } catch (err) {
            console.log(err);
        }
    }


    async searchProductByProductIdInProductPrice(productId) {

        try {
            const products = await SQLLiteDB.runQuery(SQLLiteDB.DB, `SELECT * FROM product_price WHERE product_id=${productId}`);
            return products
        } catch (err) {
            console.log(err);
        }
    }

    async getProductUpdatedPrice(barCode, productId) {
        try {

            let priceList;

            let updateProductPrice = new Array();

            if (barCode) {
                priceList = await this.searchProductbyBarCodeInProductPrice(barCode)
            } else if (productId) {
                priceList = await this.searchProductByProductIdInProductPrice(productId)
            }

            //validate store product exist or not
            if (priceList && priceList.length > 0 && priceList.length == 1) {

                //get scanned product
                let scannedProduct = priceList[0];

                const productDetail = await this.searchProductByProductId(scannedProduct.product_id);

                if (productDetail && productDetail.length > 0) {

                    let productObject = { ...productDetail[0] };

                    productObject.cost = scannedProduct.cost_price;

                    productObject.sale_price = scannedProduct.sale_price;

                    productObject.mrp = scannedProduct.mrp;

                    productObject.barcode = scannedProduct.barcode;

                    productObject.productPriceId = scannedProduct.product_price_id;

                    updateProductPrice.push(productObject);

                }

            } else if (priceList && priceList.length > 1) {

                for (let i = 0; i < priceList.length; i++) {

                    let productDetail = await this.searchProductByProductId(priceList[i].product_id);

                    if (productDetail && productDetail.length > 0) {

                        let productObject = { ...productDetail[0] };

                        productObject.cost = priceList[i].cost_price;

                        productObject.sale_price = priceList[i].sale_price;

                        productObject.mrp = priceList[i].mrp;

                        productObject.barcode = priceList[i].barcode;

                        productObject.productPriceId = priceList[i].product_price_id;

                        updateProductPrice.push(productObject);

                    }

                }
            }

            return updateProductPrice;


        } catch (err) {
            console.log(err);
        }
    }

    async SearchFromLocalDB(searchString) {

        try {
            const products = await SQLLiteDB.runQuery(SQLLiteDB.DB, `SELECT * FROM product_index WHERE product_display_name LIKE '%${searchString}%' OR brand_name LIKE '%${searchString}%' OR barcode='${searchString}' OR barcode='${searchString}'`);
            return products
        } catch (err) {
            console.log(err);
        }
    }

    async DeleteAllFromLocalDB(SQliteDbInstance) {

        await SQLLiteDB.runQuery(SQliteDbInstance, `DELETE FROM product_index`);

    }

    async InsertIntoLocalDB(SQliteDbInstance, createData) {

        let productObject = ObjectLib.getKeyValue(createData);

        await SQLLiteDB.runQuery(SQliteDbInstance, `INSERT INTO product_index (${productObject.keyString}) VALUES (${productObject.createPlaceHolderString})`, productObject.valuesArrray);


    }
    async getProductsFromLocalDB(callback) {

        let products = await SQLLiteDB.runQuery(SQLLiteDB.DB, `SELECT * FROM product_index`);

        callback(products)
    }

    async reindex(productId, callback) {
        try {
            if (productId) {

                apiClient.put(`${endpoints().productAPI}/reindex/${productId}`, null, (error, res) => {
                    return callback(null, res)
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, "")
        }
    }

}

const productService = new ProductService();

export default productService;