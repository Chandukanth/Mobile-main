import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import SQLLiteDB from "../lib/SQLLiteDB";
import ObjectLib from "../lib/Object";
import AlertModal from "../components/Alert";
import Numbers from "../lib/Number";
import systemLogService from "./SystemLogService";
import ObjectName from "../helper/ObjectName";
import asyncStorageService from "./AsyncStorageService";

class SyncService {

    static getData(params, callback) {
        try {

            const queryString = [];

            let apiUrl = `${endpoints().SyncApi}`

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString.length > 0) {
                apiUrl = `${apiUrl}?${queryString.join("&")}`;
            }

            apiClient.get(apiUrl, (error, res) => {
                return callback(null, res)
            })
        } catch (err) {
            console.log(err);
        }
    }

    static async syncProductToSQLite(productList) {
        try {
            // validate produc list exist or not
            if (productList && productList.length > 0) {
                //loop the product list
                for (let i = 0; i < productList.length; i++) {

                    //crea update object
                    let createData = {
                        product_id: productList[i].id,
                        product_name: productList[i].name,
                        brand_id: productList[i].brand_id,
                        size: productList[i].size,
                        unit: productList[i].unit,
                        product_display_name: productList[i].product_display_name,
                        product_media_id: productList[i].product_media_id,
                        brand_name: productList[i].brand,
                        category_id: productList[i].category_id,
                        category_name: productList[i].category,
                        cost: productList[i].cost,
                        sale_price: productList[i].sale_price,
                        mrp: productList[i].mrp,
                        company_id: productList[i].company_id,
                        created_at: productList[i].createdAt,
                        updated_at: productList[i].updatedAt,
                        featured_media_url: productList[i].image,
                        quantity: productList[i].quantity,
                        max_quantity: productList[i].max_quantity,
                        min_quantity: productList[i].min_quantity,
                        status: productList[i].statusValue,
                        allow_transfer_out_of_stock: productList[i].allow_transfer_out_of_stock,
                        barcode: productList[i].barcode,
                        profit_amount: Numbers.GetFloat(productList[i].margin_amount),
                        profit_percentage: productList[i].margin_percentage,
                        allow_sell_out_of_stock: productList[i].sell_out_of_stock,
                        tax_percentage: Numbers.GetFloat(productList[i].tax_percentage),
                        pack_size: Numbers.GetFloat(productList[i].pack_size),
                        print_name: productList[i].print_name,
                        cgst_percentage: Numbers.GetFloat(productList[i].cgst_percentage),
                        sgst_percentage: Numbers.GetFloat(productList[i].sgst_percentage),
                        cgst_amount: Numbers.GetFloat(productList[i].cgst_amount),
                        sgst_amount: Numbers.GetFloat(productList[i].sgst_amount),
                    }

                    let productObject = ObjectLib.getKeyValue(createData);
                    //insert data into sqlite
                    await SQLLiteDB.runQuery(SQLLiteDB.DB, `INSERT INTO product_index (${productObject.keyString}) VALUES (${productObject.createPlaceHolderString})`, productObject.valuesArrray);
                }


            }
            //    Closing the Local Db

        } catch (err) {
            console.log(err);
        }
    }

    static async syncProductPrice(productPriceList) {
        try {

            for (let i = 0; i < productPriceList.length; i++) {

                let createData = {
                    product_price_id: Numbers.Get(productPriceList[i].id),
                    product_id: Numbers.Get(productPriceList[i].product_id),
                    barcode: productPriceList[i].barCode,
                    cost_price: Numbers.GetFloat(productPriceList[i].costPrice),
                    sale_price: Numbers.GetFloat(productPriceList[i].salePrice),
                    mrp: Numbers.GetFloat(productPriceList[i].mrp),
                    company_id: Numbers.Get(productPriceList[i].companyId)
                }

                let productPriceObject = ObjectLib.getKeyValue(createData);

                //insert data into sqlite
                await SQLLiteDB.runQuery(SQLLiteDB.DB, `INSERT INTO product_price (${productPriceObject.keyString}) VALUES (${productPriceObject.createPlaceHolderString})`, productPriceObject.valuesArrray);

            }

        } catch (err) {
            console.log(err);
            return callback();
        }
    }

    static async SyncStatus(statusList) {
        try {
            if (statusList && statusList.length > 0) {

                for (let i = 0; i < statusList.length; i++) {

                    let createData = {
                        status_id: Numbers.Get(statusList[i].id),
                        name: statusList[i].name,
                        color_code: statusList[i].colorCode,
                        next_status_id: statusList[i].nextStatusIds,
                        sort_order: Numbers.Get(statusList[i].sortOrder),
                        allowed_role_id: statusList[i].allowedRoleIds,
                        object_name: statusList[i].objectName,
                        update_quantity: Numbers.Get(statusList[i].updateQuantity),
                        company_id: Numbers.Get(statusList[i].companyId),
                        group_id: Numbers.Get(statusList[i].group),
                        allow_edit: Numbers.Get(statusList[i].allowEdit),
                        project_id: Numbers.Get(statusList[i].projectId),
                    }

                    let statusObject = ObjectLib.getKeyValue(createData);

                    //insert data into sqlite
                    await SQLLiteDB.runQuery(SQLLiteDB.DB, `INSERT INTO status (${statusObject.keyString}) VALUES (${statusObject.createPlaceHolderString})`, statusObject.valuesArrray);
                }

            }

        } catch (err) {
            console.log(err);
        }
    }

    static async SyncProduct(barCode, productId, callback) {
        try {
            let lastSyncDate = new Date();

            let params = new Object;

            if (barCode) {
                params.barCode = barCode;
            }

            if (productId) {
                params.productId = productId;
            }

            await asyncStorageService.setLastSync(lastSyncDate.toString());

            //get the product list
            SyncService.getData({ ...params }, async (error, response) => {

                let productList = response && response.data && response.data.productList;

                let priceList = response && response.data && response.data.priceList;

                if (barCode || productId) {

                    if (productList && productList.length > 0) {
                        for (let i = 0; i < productList.length; i++) {
                            await SQLLiteDB.runQuery(SQLLiteDB.DB, `DELETE FROM product_index where product_id=${productList[i].id}`);
                        }
                    }

                    if (productId) {
                        if (priceList && priceList.length > 0) {
                            for (let i = 0; i < priceList.length; i++) {
                                await SQLLiteDB.runQuery(SQLLiteDB.DB, `DELETE FROM product_price where product_id=${priceList[i].product_id}`);
                            }
                        }
                    }

                }

                if (productList && productList.length > 0) {
                    await this.syncProductToSQLite(productList);
                }

                if (priceList && priceList.length > 0) {
                    await this.syncProductPrice(priceList);
                }

                systemLogService.create({ message: "Sync Completed", OBJECT_NAME: ObjectName.SYSTEM })

                return callback(productList);

            })
        } catch (err) {
            console.log(err);
        }
    }

    static async Sync(callback) {
        try {
            let lastSyncDate = new Date();

            await asyncStorageService.setLastSync(lastSyncDate.toString());

            //get the product list
            SyncService.getData({}, async (error, response) => {

                let productList = response && response.data && response.data.productList;

                let priceList = response && response.data && response.data.priceList;

                let statusList = response && response.data && response.data.statusList;

                await SQLLiteDB.runQuery(SQLLiteDB.DB, `DELETE FROM status`);

                await SQLLiteDB.runQuery(SQLLiteDB.DB, `DELETE FROM product_index`);

                await SQLLiteDB.runQuery(SQLLiteDB.DB, `DELETE FROM product_price`);

                if (statusList && statusList.length > 0) {
                    await this.SyncStatus(statusList);
                }

                if (productList && productList.length > 0) {
                    await this.syncProductToSQLite(productList);
                }

                if (priceList && priceList.length > 0) {
                    await this.syncProductPrice(priceList);
                }

                systemLogService.create({ message: "Sync Completed", OBJECT_NAME: ObjectName.SYSTEM })

                return callback(productList);

            })
        } catch (err) {
            //show error toast message
            AlertModal("Error", err.message);
            return callback()
        }
    }
}

export default SyncService;