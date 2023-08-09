import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";
import OnePortalDB from "../lib/SQLLiteDB";
import Object from "../lib/Object";
import AlertModal from "../components/Alert";
let DB = OnePortalDB.open('oneportal.db');
import Url from "../lib/Url";

class StockEntryService {

    async addStockEntry(storeId, date, callback) {
        try {
            if (storeId) {

                let stockEntryApi = `${endpoints().stockEntry}`;

                apiClient.post(stockEntryApi, { storeId, date: date }, (error, res) => {
                    if (res.data && res.data.stockEntryDetails) {
                        return callback(null, res);
                    }


                    return callback(null, res);

                })
            }

        } catch (err) {
            console.log(err);
        }
    }

    async addStockEntryProducts(objectData, callback) {
        try {
            if (objectData) {

                let stockProductEntry = `${endpoints().stockProductEntry}`;

                apiClient.post(stockProductEntry, objectData, (error, res) => {
                    return callback(null, res);
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }


    async updateStockEntryProduct(objectData, stockEntryProductId, callback) {
        try {
            if (objectData) {

                let stockProductEntry = `${endpoints().stockProductEntry}/${stockEntryProductId}`;

                apiClient.put(stockProductEntry, objectData, (error, res) => {
                    return callback(null, res);
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async getStockEntryProducts(storeId, stockEntryId, setIsLoading, callback,) {
        try {
            if (storeId && stockEntryId) {
               
                setIsLoading && setIsLoading(true);
               
                let stockEntryProducts = new Array();

                let apiUrl = await Url.get(`${endpoints().stockProductEntry}/search`, { storeId: storeId, stockEntryId: stockEntryId, sort: "updatedAt", sortDir : "DESC", pagination: false  })

                apiClient.get(apiUrl, (error, res) => {

                    if (res && res.data && res.data.data) {

                        let totalQuantity = res.data.totalQuantity;

                        let stockEntryProductList = res.data.data;

                        let totalCount = res.data.totalCount

                        //validate stock entry product list
                        if (stockEntryProductList && stockEntryProductList.length > 0) {

                            //loop the stock entry product list
                            for (let i = 0; i < stockEntryProductList.length; i++) {

                                const { id, quantity, image, product_name, product_id, product_display_name, brand_name, mrp, sale_price, companyId, createdAt, updatedAt, size, unit } = stockEntryProductList[i];

                                //validate quantity exist or not


                                // push the stock entry product
                                stockEntryProducts.push({
                                    image: image,
                                    product_display_name: product_display_name,
                                    brand_name: brand_name,
                                    name: product_name,
                                    stockEntryProductId: id,
                                    id: id,
                                    quantity: quantity,
                                    name: product_name,
                                    product_id: product_id,
                                    sale_price: sale_price,
                                    mrp: mrp,
                                })

                            }
                            setIsLoading && setIsLoading(false);
                            return callback && callback(null, stockEntryProducts, totalQuantity, totalCount);


                        } else {
                            return callback(null, []);
                        }
                    }
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }

    async getStockList(setPage, setHasMore, setIsLoading, setTotalStock, setStockEntryList) {
        try {
            setIsLoading && setIsLoading(true);
            setPage && setPage(2);
            setHasMore && setHasMore("0");

            apiClient.get(
                `${endpoints().stockEntry
                }/search?page=${1}&pageSize=${25}&sort=${"createdAt"}&sortDir=${"DESC"}`
                , (error, response) => {

                    let totalCount = response?.data.totalCount;

                    let stockList = response?.data?.data;

                    // Set response in state
                    setTotalStock && setTotalStock(totalCount);

                    setStockEntryList && setStockEntryList(stockList)

                    setIsLoading && setIsLoading(false);
                });
        } catch (err) {
            console.log(err);
            setIsLoading && setIsLoading(false);
        }
    }

    async getPageSizeProductList(storeId, stockEntryId, page, callback,) {
        try {
            if (storeId && stockEntryId) {

                let stockEntryProducts = new Array();

                let totalQuantity = 0;

                let stockProductEntry = `${endpoints().stockProductEntry}/search?page=${page}&storeId=${storeId}&stockEntryId=${stockEntryId}&sort=updatedAt&sortDir=DESC`;

                apiClient.get(stockProductEntry, (error, res) => {

                    if (res && res.data && res.data.data) {

                        let stockEntryProductList = res.data.data;

                        let totalCount = res.data.totalCount

                        //validate stock entry product list
                        if (stockEntryProductList && stockEntryProductList.length > 0) {

                            //loop the stock entry product list
                            for (let i = 0; i < stockEntryProductList.length; i++) {

                                const { id, quantity, image, product_name, product_id, product_display_name, brand_name, mrp, sale_price, companyId, createdAt, updatedAt } = stockEntryProductList[i];

                                //validate quantity exist or not
                                if (quantity) {
                                    totalQuantity = totalQuantity + quantity;
                                }

                                // push the stock entry product
                                stockEntryProducts.push({
                                    image: image,
                                    product_display_name: product_display_name,
                                    name: product_name,
                                    stockEntryProductId: id,
                                    id: id,
                                    quantity: quantity,
                                    name: product_name,
                                    product_id: product_id,
                                    brand_name: brand_name,
                                    sale_price: sale_price,
                                    mrp: mrp,
                                    company_id: companyId,
                                    createdAt: createdAt,
                                    updatedAt: updatedAt
                                })

                            }
                            return callback(null, stockEntryProducts, totalQuantity, totalCount);


                        } else {
                            return callback(null, []);
                        }
                    }
                })
            }

        } catch (err) {
            console.log(err);
            return callback(err, []);
        }
    }

    async deleteStockEntryProduct(stockEntryProductId, callback) {
        try {
            if (stockEntryProductId) {


                let stockProductEntry = `${endpoints().stockProductEntry}/${stockEntryProductId}`;

                apiClient.delete(stockProductEntry, (error, res) => {
                    if (res.data && res.data) {
                        

                        return callback(null, res);
                    }
                })
            }

        } catch (err) {
            console.log(err);
        }
    }

    async UpdateStockEntry(id, UpdateData, callback) {
        try {
            if (id && UpdateData) {

                apiClient
                    .put(`${endpoints().stockEntry}/${id}`, UpdateData, (error, response) => {
                       
                        return callback(null, response);
                    })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async DeleteStockEntry(id, callback) {
        try {
            if (id) {


                // apiClient
                apiClient.delete(`${endpoints().stockEntry}/${id}`, (error, res) => {
                   
                    return callback();
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async syncStockEntry(stockEntryDetail) {
        try {
            //validate stock entry ID exist or not
            if (stockEntryDetail) {

                //crea update object
                let createData = {
                    stock_entry_id: stockEntryDetail.id,
                    store_id: stockEntryDetail.store_id,
                    date: stockEntryDetail.date,
                    stock_entry_number: stockEntryDetail.stock_entry_number,
                    status: stockEntryDetail.status,
                    owner_id: stockEntryDetail.owner_id,
                    company_id: stockEntryDetail.company_id,
                    created_at: stockEntryDetail.createdAt,
                    updated_at: stockEntryDetail.updatedAt
                }

                //get stock entry
                let isStockEntryDetailExist = await OnePortalDB.runQuery(DB, `SELECT * FROM stock_entry WHERE stock_entry_id=${stockEntryDetail.id}`);

                let stockEntryObjectKeyValue = Object.getKeyValue(createData);

                // validate product exist or not
                if (isStockEntryDetailExist && Array.isArray(isStockEntryDetailExist) && isStockEntryDetailExist.length == 0) {

                    if (stockEntryObjectKeyValue) {
                        // insert data into sqlite
                        await OnePortalDB.runQuery(DB, `INSERT INTO stock_entry (${stockEntryObjectKeyValue.keyString}) VALUES (${stockEntryObjectKeyValue.createPlaceHolderString})`, stockEntryObjectKeyValue.valuesArrray);
                    }
                } else {
                    //update the product data
                    await OnePortalDB.runQuery(DB, `UPDATE stock_entry SET ${stockEntryObjectKeyValue.updatePlaceHolderArray} WHERE stock_entry_id=${stockEntryDetail.id}`, stockEntryObjectKeyValue.valuesArrray);
                }

                //sync stock entry products
                this.getStockEntryProducts(stockEntryDetail.store_id, stockEntryDetail.id, async (error, stockEntryProducts) => {


                    if (stockEntryProducts && stockEntryProducts.length > 0) {

                        for (let i = 0; i < stockEntryProducts.length; i++) {

                            let stockProductCreateData = {
                                stock_entry_product_id: stockEntryProducts[i].id,
                                stock_entry_id: stockEntryDetail.id,
                                store_id: stockEntryDetail.store_id,
                                product_id: stockEntryProducts[i].product_id,
                                company_id: stockEntryProducts[i].company_id,
                                created_at: stockEntryProducts[i].createdAt,
                                updated_at: stockEntryProducts[i].updatedAt,
                            }


                            //get stock entry
                            let isStockProductExist = await OnePortalDB.runQuery(DB, `SELECT * FROM stock_entry_product WHERE product_id=${stockEntryProducts[i].product_id} AND stock_entry_id=${stockEntryDetail.id}`);

                            let stockProductObjectKeyValue = Object.getKeyValue(stockProductCreateData);

                            // validate product exist or not
                            if (isStockProductExist && Array.isArray(isStockProductExist) && isStockProductExist.length == 0) {

                                stockProductCreateData.quantity = stockEntryProducts[i].quantity;

                                if (stockEntryObjectKeyValue) {
                                    // insert data into sqlite
                                    await OnePortalDB.runQuery(DB, `INSERT INTO stock_entry_product (${stockProductObjectKeyValue.keyString}) VALUES (${stockProductObjectKeyValue.createPlaceHolderString})`, stockProductObjectKeyValue.valuesArrray);
                                }
                            } else {

                                let stockEntryProduct = isStockProductExist[0];

                                stockProductCreateData.quantity = stockEntryProduct && stockEntryProduct.quantity;

                                //update the product data
                                await OnePortalDB.runQuery(DB, `UPDATE stock_entry_product SET ${stockProductObjectKeyValue.updatePlaceHolderArray} WHERE product_id=${stockEntryProducts[i].product_id} AND stock_entry_id=${stockEntryDetail.id}`, stockProductObjectKeyValue.valuesArrray);
                            }
                        }

                    }

                })

            }

        } catch (err) {
            console.log(err);
        }
    }

    async getStockEntryProductFromDB(stockEntryId, callback) {
        try {
            try {
                let updatedStockProductList = new Array();

                //create total quantoty
                let totalQuantity = 0;

                let stockEntryProductList = await OnePortalDB.runQuery(DB, `SELECT * FROM stock_entry_product WHERE stock_entry_id=${stockEntryId} ORDER BY id DESC`);

                if (stockEntryProductList && stockEntryProductList.length > 0) {

                    for (let i = 0; i < stockEntryProductList.length; i++) {

                        const { stock_entry_product_id, stock_entry_id, product_id, quantity, id } = stockEntryProductList[i];

                        //validate quantity exist or not
                        if (quantity) {
                            totalQuantity = totalQuantity + quantity;
                        }

                        let productDetail = await OnePortalDB.runQuery(DB, `SELECT * FROM product_index WHERE product_id=${product_id}`);

                        if (productDetail && productDetail.length > 0) {

                            productDetail = productDetail[0];


                            updatedStockProductList.push({
                                stockEntryId: stock_entry_id,
                                localStockEntryProductId: id,
                                id: id,
                                stockEntryProductId: stock_entry_product_id,
                                image: productDetail.featured_media_url,
                                product_display_name: productDetail.product_display_name,
                                name: productDetail.product_name,
                                product_id: product_id,
                                quantity: quantity,
                                brand_name: productDetail.brand_name,
                                sale_price: productDetail.sale_price,
                                mrp: productDetail.mrp,
                                companyId: productDetail.company_id,
                            })
                        }

                    }
                }
                return callback(null, updatedStockProductList, totalQuantity)

            } catch (err) {
                console.log(err);
                return callback(err, [], "")
            }
        } catch (err) {
            console.log(err);
        }
    }

    async stockProductBulkInsert(stockEntryId, stockProducts) {
        try {

            if (stockEntryId && stockProducts) {

                let bodyData = {
                    stockEntryId: stockEntryId,
                    stockProducts: stockProducts,
                };

                apiClient.post(`${endpoints().stockProductEntry}/bulkInsert`, bodyData,(error, response) => {

                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async stockProductBulkUpdate(stockProducts) {
        try {
            if (stockProducts) {


                let bodyData = {
                    stockProducts: stockProducts,
                };

                apiClient.put(`${endpoints().stockProductEntry}/bulkUpdate`, bodyData,(error, response) => {

                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateStockEntryProducts(stockEntryId, store_id) {
        try {
            let stockProductList = await OnePortalDB.runQuery(DB, `SELECT * FROM stock_entry_product WHERE stock_entry_id=${stockEntryId}`);

            let addedStockProductList = new Array();

            let updateStockProductList = new Array();

            if (stockProductList && stockProductList.length > 0) {

                for (let i = 0; i < stockProductList.length; i++) {
                    const { stock_entry_product_id, stock_entry_id, product_id, quantity, company_id } = stockProductList[i];


                    if (stock_entry_product_id) {
                        updateStockProductList.push({
                            stock_entry_product_id, stock_entry_id, product_id, quantity, company_id, store_id
                        })
                    } else {
                        addedStockProductList.push({
                            stock_entry_id, product_id, quantity, company_id, store_id
                        })
                    }

                }

                if (updateStockProductList && updateStockProductList.length > 0) {
                    this.stockProductBulkUpdate(updateStockProductList, () => { });
                }

                if (addedStockProductList && addedStockProductList.length > 0) {
                    this.stockProductBulkInsert(stockEntryId, addedStockProductList, () => { });
                }

            }

            return true;

        } catch (err) {
            console.log(err);
        }
    }

}

const stockEntryService = new StockEntryService();

export default stockEntryService;