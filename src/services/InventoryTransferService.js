
import AsyncStorage from "../lib/AsyncStorage";
import AsyncStorageConstants from "../helper/AsyncStorage";
import apiClient from "../apiClient";
import { endpoints } from "../helper/ApiEndPoint";

import OnePortalDB from "../lib/SQLLiteDB";

import ObjectLib from "../lib/Object";

import DateTime from "../lib/DateTime";

import AsyncStorageService from "../services/AsyncStorageService";

let DB = OnePortalDB.open('oneportal.db');

class InventoryTransferService {


    async getProductList(inventoryTransferProducts) {
        try {
            //create new array
            let inventoryProductsList = new Array();
            //inventory transfer products
            if (inventoryTransferProducts && inventoryTransferProducts.length > 0) {
                //create total quantoty
                let totalQuantity = 0;
                //loop the stock entry product list
                for (let i = 0; i < inventoryTransferProducts.length; i++) {
                    const { quantity, id, product_name, storeProductId, image, product_display_name, brand_name, mrp, sale_price, product_id, companyId, statusValue, updatedAt, createdAt, unit_price, amount, status, currentStatusId } = inventoryTransferProducts[i];

                    //validate quantity exist or not
                    if (quantity) {
                        totalQuantity = totalQuantity + quantity;
                    }

                    //push the stock entry product
                    inventoryProductsList.push({
                        image: image,
                        product_display_name: product_display_name,
                        name: product_name,
                        inventoryTransferProductId: id,
                        id: storeProductId,
                        product_id: product_id,
                        quantity: quantity,
                        brand_name: brand_name,
                        sale_price: sale_price,
                        mrp: mrp,
                        unit_price: unit_price,
                        amount: amount,
                        companyId: companyId,
                        statusValue: statusValue,
                        updatedAt: updatedAt,
                        createdAt: createdAt,
                        status: status,
                        currentStatusId: currentStatusId
                    })
                }
                return { inventoryProductsList, totalQuantity }
            } else {
                return {};
            }
        } catch (err) {
            console.log(err);
            return {};
        }
    }
    async getInventoryProductList(InventoryTransferId, storeId, callback) {
        try {

            let inventoryProductsList;;

            let totalQuantity = 0;

            //validate store Id and stock entry Id Exist or not
            if (storeId && InventoryTransferId) {

                apiClient.get(
                    `${endpoints().transferProduct}/search?fromLocationId=${storeId}&transferId=${InventoryTransferId}&sort=updatedAt&sortDir=DESC&pagination=false`
                    , async (error, response) => {

                        //validate response exist or not
                        if (response && response.data && response.data.data) {
                            let totalCount = response.data.totalCount
                            //get stock entry product list
                            let inventoryTransferProducts = response.data.data;

                            //validate stock entry product list
                            if (inventoryTransferProducts && inventoryTransferProducts.length > 0) {

                                //process the lsit
                                let inventoryObject = await this.getProductList(inventoryTransferProducts);

                                //validate inveotry object exist or not
                                if (inventoryObject) {
                                    //get invenotry list
                                    inventoryProductsList = inventoryObject.inventoryProductsList;
                                    //get the total quantity
                                    totalQuantity = inventoryObject.totalQuantity
                                }

                                return callback(null, inventoryProductsList, totalQuantity, totalCount)

                            } else {
                                return callback(null, [], totalQuantity, totalCount)
                            }

                        }
                    })

            }
        } catch (err) {
            console.log(err);
            return callback(err, [], "")
        }
    }

    async search(params, callback) {
        try {
            const queryString = [];

            let apiUrl;

            if (params) {
                Object.keys(params).forEach((param) => {
                    queryString.push(`${param}=${params[param]}`);
                });
            }

            if (queryString && queryString.length > 0) {
                apiUrl = `${endpoints().inventoryTransferAPI}/search?${queryString.join("&")}`;
            } else {
                apiUrl = `${endpoints().inventoryTransferAPI}/search`;
            }


            apiClient
                .get(apiUrl, (error, response) => {
                    return callback(null, response);
                })
        } catch (err) {
            return callback(err, null);

        }
    }

    async getPageProductList(InventoryTransferId, storeId, page, callback) {
        try {

            let inventoryProductsList;;

            let totalQuantity = 0;

            //validate store Id and stock entry Id Exist or not
            if (storeId && InventoryTransferId) {

                apiClient.get(
                    `${endpoints().transferProduct}/search?page=${page}&fromLocationId=${storeId}&transferId=${InventoryTransferId}&sort=updatedAt&sortDir=DESC`
                    , async (error, response) => {

                        //validate response exist or not
                        if (response && response.data && response.data.data) {

                            //get stock entry product list
                            let inventoryTransferProducts = response.data.data;

                            //validate stock entry product list
                            if (inventoryTransferProducts && inventoryTransferProducts.length > 0) {

                                //process the lsit
                                let inventoryObject = await this.getProductList(inventoryTransferProducts);

                                //validate inveotry object exist or not
                                if (inventoryObject) {
                                    //get invenotry list
                                    inventoryProductsList = inventoryObject.inventoryProductsList;
                                    //get the total quantity
                                    totalQuantity = inventoryObject.totalQuantity
                                }

                                return callback(null, inventoryProductsList, totalQuantity)

                            } else {
                                return callback(null, [], totalQuantity)
                            }

                        }
                    })

            }
        } catch (err) {
            console.log(err);
            return callback(err, [], "")
        }
    }

    async getInventoryList(setPage, setHasMore, setIsLoading, setInventoryTransferList) {
        try {
            setIsLoading && setIsLoading(true);
            setPage && setPage(2);
            setHasMore && setHasMore("0");

            apiClient.get(
                `${endpoints().inventoryTransferAPI
                }/search?page=1`
                , (error, response) => {

                    let inventoryTransferList = response?.data?.data;

                    // Set response in state
                    setInventoryTransferList && setInventoryTransferList(inventoryTransferList);

                    setIsLoading && setIsLoading(false);
                });
        } catch (err) {
            console.log(err);
            setIsLoading && setIsLoading(false);
        }
    }

    async addInventoryProduct(bodyData, callback) {
        try {

            apiClient.post(`${endpoints().transferProduct}`, bodyData, (error, response) => {
                //validate response exist or not


                return callback(null, response);

            })

        } catch (err) {
            console.log(err);
            return callback(err, null);
        }

    }

    async updateInventoryProduct(bodyData, transferProductId, callback) {
        try {

            apiClient.put(`${endpoints().transferProduct}/${transferProductId}`, bodyData, (error, response) => {
                //validate response exist or not


                return callback(null, response);

            })
        } catch (err) {
            console.log(err);
            return callback(false);
        }

    }

    async deleteInventoryTransferProduct(Id, callback) {
        try {
            if (Id) {

                apiClient.delete(`${endpoints().transferProduct}/${Id}`, (error, response) => {
                    //validate response exist or not

                    return callback();

                })
            }

        } catch (err) {
            console.log(err);
        }

    }


    async addInventory(bodyData, callback) {
        try {
            if (bodyData) {


                apiClient
                    .post(`${endpoints().inventoryTransferAPI}`, bodyData, (error, response) => {
                        if (response && response.data && response.data.transferDetails) {
                            let transferDetails = response.data.transferDetails;

                            let currentStatusId = response.data.currentStatusId;

                            return callback(null, transferDetails, currentStatusId);
                        }
                    })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null)
        }
    };

    async DeleteTransfer(id, callback) {

        try {
            if (id) {


                // apiClient
                apiClient.delete(`${endpoints().inventoryTransferAPI}/delete/${id}`, (error, res) => {

                    return callback();
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async updateInventory(id, UpdateData, callback) {
        try {
            if (id && UpdateData) {

                apiClient
                    .put(`${endpoints().inventoryTransferAPI}/${id}`, UpdateData, (error, response) => {
                        if (response && response.data && response.data.message) {

                        }

                        return callback(null, response);
                    })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null);
        }
    }

    async syncInventory(inventoryDetails) {
        try {

            if (inventoryDetails) {
                //crea update object
                let createData = {
                    transfer_id: inventoryDetails.id,
                    from_store_id: inventoryDetails.from_store_id,
                    to_store_id: inventoryDetails.to_store_id,
                    date: inventoryDetails.date,
                    status: inventoryDetails.statusValue,
                    company_id: inventoryDetails.companyId,
                    created_at: inventoryDetails.createdAt,
                    updated_at: inventoryDetails.updatedAt,
                    transfer_number: inventoryDetails.transfer_number,
                    type: inventoryDetails.type
                }

                //get transfer
                let transferExist = await OnePortalDB.runQuery(DB, `SELECT * FROM transfer WHERE transfer_id=${inventoryDetails.id}`);

                let tranferObjectKeyValue = ObjectLib.getKeyValue(createData);

                //validate product exist or not
                if (transferExist && Array.isArray(transferExist) && transferExist.length == 0) {

                    if (tranferObjectKeyValue) {
                        // insert data into sqlite
                        await OnePortalDB.runQuery(DB, `INSERT INTO transfer (${tranferObjectKeyValue.keyString}) VALUES (${tranferObjectKeyValue.createPlaceHolderString})`, tranferObjectKeyValue.valuesArrray);
                    }
                } else {
                    //update the product data
                    await OnePortalDB.runQuery(DB, `UPDATE transfer SET ${tranferObjectKeyValue.updatePlaceHolderArray} WHERE transfer_id=${inventoryDetails.id}`, tranferObjectKeyValue.valuesArrray);
                }

                this.getInventoryProductList(inventoryDetails.id, inventoryDetails.from_store_id, async (err, inventoryProductList) => {

                    if (inventoryProductList && inventoryProductList.length > 0) {

                        for (let i = 0; i < inventoryProductList.length; i++) {

                            let transferProductCreateData = {
                                transfer_product_id: inventoryProductList[i].inventoryTransferProductId,
                                transfer_id: inventoryDetails.id,
                                quantity: inventoryProductList[i].quantity,
                                status: inventoryProductList[i].statusValue,
                                amount: inventoryProductList[i].amount,
                                unit_price: inventoryProductList[i].unit_price,
                                product_id: inventoryProductList[i].product_id,
                                company_id: inventoryProductList[i].companyId,
                                created_at: inventoryProductList[i].createdAt,
                                updated_at: inventoryProductList[i].updatedAt
                            }

                            //get transfer
                            let transferProductExist = await OnePortalDB.runQuery(DB, `SELECT * FROM transfer_product WHERE product_id=${inventoryProductList[i].product_id} AND transfer_id=${inventoryDetails.id}`);

                            let tranferProductObjectKeyValue = ObjectLib.getKeyValue(transferProductCreateData);

                            //validate product exist or not
                            if (transferProductExist && Array.isArray(transferProductExist) && transferProductExist.length == 0) {

                                if (tranferProductObjectKeyValue) {
                                    // insert data into sqlite
                                    await OnePortalDB.runQuery(DB, `INSERT INTO transfer_product (${tranferProductObjectKeyValue.keyString}) VALUES (${tranferProductObjectKeyValue.createPlaceHolderString})`, tranferProductObjectKeyValue.valuesArrray);
                                }
                            } else {
                                //update the product data
                                await OnePortalDB.runQuery(DB, `UPDATE transfer_product SET ${tranferProductObjectKeyValue.updatePlaceHolderArray} WHERE product_id=${inventoryProductList[i].product_id} AND transfer_id=${inventoryDetails.id}`, tranferProductObjectKeyValue.valuesArrray);
                            }

                        }

                    }

                });

            }

        } catch (err) {
            console.log(err);
        }
    }

    async transferProductBulkInsert(transferId, transferProducts) {
        try {

            if (transferId && transferProducts) {



                let bodyData = {
                    transferId: transferId,
                    transferProducts: transferProducts,
                };

                apiClient.post(`${endpoints().transferProduct}/bulkInsert`, bodyData, (error, response) => {

                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async transferProductBulkUpdate(transferProducts) {
        try {
            if (transferProducts) {



                let bodyData = {
                    transferProducts: transferProducts,
                };

                apiClient.post(`${endpoints().transferProduct}/bulkUpdate`, bodyData, (error, response) => {

                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getInventoryProducts(InventoryTransferId, callback) {
        try {
            let updatedInventoryProductList = new Array();

            //create total quantoty
            let totalQuantity = 0;

            let inventoryProductList = await OnePortalDB.runQuery(DB, `SELECT * FROM transfer_product WHERE transfer_id=${InventoryTransferId} ORDER BY id DESC`);

            if (inventoryProductList && inventoryProductList.length > 0) {

                for (let i = 0; i < inventoryProductList.length; i++) {

                    const { product_id, quantity, transfer_product_id, id, status } = inventoryProductList[i];

                    //validate quantity exist or not
                    if (quantity) {
                        totalQuantity = totalQuantity + quantity;
                    }

                    let productDetail = await OnePortalDB.runQuery(DB, `SELECT * FROM product_index WHERE product_id=${product_id}`);

                    if (productDetail && productDetail.length > 0) {

                        productDetail = productDetail[0];

                        updatedInventoryProductList.push({
                            id: id,
                            local_transfer_product_id: id,
                            image: productDetail.featured_media_url,
                            product_display_name: productDetail.product_display_name,
                            name: productDetail.product_name,
                            inventoryTransferProductId: transfer_product_id,
                            product_id: product_id,
                            quantity: quantity,
                            brand_name: productDetail.brand_name,
                            sale_price: productDetail.sale_price,
                            mrp: productDetail.mrp,
                            companyId: productDetail.company_id,
                            currentStatusId: status
                        })
                    }

                }
            }
            return callback(null, updatedInventoryProductList, totalQuantity)

        } catch (err) {
            console.log(err);
            return callback(err, [], "")
        }

    }

    async updateInventoryProducts(transferId, fromLocationId, toLocationId) {
        try {
            let inventoryProductList = await OnePortalDB.runQuery(DB, `SELECT * FROM transfer_product WHERE transfer_id=${transferId}`);

            let addedInventoryProductList = new Array();

            let updateInventoryProductList = new Array();

            if (inventoryProductList && inventoryProductList.length > 0) {

                for (let i = 0; i < inventoryProductList.length; i++) {
                    const { transfer_product_id, transfer_id, quantity, product_id, amount, unit_price, company_id } = inventoryProductList[i];

                    if (transfer_product_id) {
                        updateInventoryProductList.push({
                            transfer_product_id, transfer_id, quantity, product_id, amount, unit_price, company_id, fromLocationId, toLocationId
                        })
                    } else {
                        addedInventoryProductList.push({
                            transfer_product_id, transfer_id, quantity, product_id, amount, unit_price, company_id, fromLocationId, toLocationId
                        })
                    }

                }

                if (updateInventoryProductList && updateInventoryProductList.length > 0) {
                    this.transferProductBulkUpdate(updateInventoryProductList, () => { });
                }

                if (addedInventoryProductList && addedInventoryProductList.length > 0) {
                    this.transferProductBulkInsert(transferId, addedInventoryProductList, () => { });
                }

            }

            return true;

        } catch (err) {
            console.log(err);
        }
    }

    async get(tansferId, callback) {
        try {


            apiClient.get(
                `${endpoints().inventoryTransferAPI
                }/${tansferId}`
                , (error, response) => {


                    let inventoryTransferList = response.data;

                    callback(inventoryTransferList)
                });
        } catch (err) {
            console.log(err);
        }
    }


    async replenish(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().inventoryTransferAPI}/replenish`, bodyData, (error, response) => {
                    return callback(null, response)
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null)
        }
    }

    async replenishAll(bodyData, callback) {
        try {
            if (bodyData) {

                apiClient.post(`${endpoints().inventoryTransferAPI}/bulkReplenish`, bodyData, (error, response) => {
                    return callback(null, response)
                })
            }
        } catch (err) {
            console.log(err);
            return callback(err, null)
        }
    }


    async onStoreSelect(selectedStore, params) {
        try {
            const FromLocation = params.fromLocationId ? params.fromLocationId : selectedStore.id;

            const ToLocation = params.toLocationId ? params.toLocationId : selectedStore.id

            let bodyData = {
                fromLocationId: FromLocation,
                toLocationId: ToLocation,
                date: new Date(),
                type: { value: params.type }
            };

            inventoryTransferService.addInventory(bodyData, async (error, transferDetails, currentStatusId) => {

                if (params?.offlineMode) {
                    await inventoryTransferService.syncInventory(transferDetails);
                }

                params.navigation.navigate("Transfer/ProductList", {
                    fromLocationId: transferDetails.from_store_id,
                    toLocationId: transferDetails.to_store_id,
                    transferId: transferDetails.id,
                    fromLocationName: params?.fromLocationName ? params?.fromLocationName : selectedStore.name,
                    toLocationName: params?.toLocationName ? params?.toLocationName : selectedStore.name,
                    type: params?.type,
                    date: DateTime.formattedfDate(new Date(), "DD-MMM-YYYY hh:mm A"),
                    offlineMode: params?.offlineMode,
                    currentStatusId: currentStatusId,
                    printName: params?.printName
                });
            });
        } catch (err) {
            console.log(err);
        }

    }

    async onTransferTypeClickStoreSelect(transferTypeList, navigation) {
        try {

            if (transferTypeList && transferTypeList.length > 1) {

                navigation.navigate("/SelectTransferType");

            } else if (transferTypeList && transferTypeList.length == 1) {

                let item = transferTypeList[0];

                if (item && item.allow_to_change_from_store == 1) {

                    navigation.navigate("StoreSelector", {
                        onSelectStore: inventoryTransferService.onStoreSelect,
                        params: { type: item.id, toLocationId: item.default_to_store ? item.default_to_store : null, toLocationName: item.default_to_store_name ? item.default_to_store_name : null, offlineMode: item?.offline_mode, navigation },
                    });

                } else if (item && item.allow_to_change_to_store == 1) {

                    navigation.navigate("StoreSelector", {
                        onSelectStore: inventoryTransferService.onStoreSelect,
                        params: { type: item.id, fromLocationId: item.default_from_store ? item.default_from_store : null, offlineMode: item?.offline_mode, fromLocationName: item.default_from_store_name ? item.default_from_store_name : null, navigation }
                    });

                } else if (item && item.default_to_store) {

                    let storeId = await AsyncStorageService.getSelectedLocationId()

                    let locationName = await AsyncStorageService.getSelectedLocationName()

                    const FromLocation = storeId ? storeId : null;

                    const ToLocation = item.default_to_store

                    let bodyData = {
                        fromLocationId: FromLocation,
                        toLocationId: ToLocation,
                        type: { value: item.id }
                    };

                    inventoryTransferService.addInventory(bodyData, async (error, transferDetails, currentStatusId) => {

                        if (transferDetails) {
                            if (item?.offlineMode) {
                                await inventoryTransferService.syncInventory(transferDetails);
                            }

                            navigation.navigate("Transfer/ProductList", {
                                fromLocationId: transferDetails.from_store_id,
                                toLocationId: transferDetails.to_store_id,
                                transferId: transferDetails.id,
                                fromLocationName: locationName ? locationName : "",
                                toLocationName: item.default_to_store_name ? item.default_to_store_name : "",
                                type: item?.id,
                                date: DateTime.getCurrentDate("DD-MMM-YYYY hh:mm A"),
                                offlineMode: item?.offlineMode,
                                currentStatusId: currentStatusId,
                                printName: item?.printName
                            });
                        }
                    });
                }

            }
        } catch (err) {
            console.log(err);
        }
    }
}


const inventoryTransferService = new InventoryTransferService();

export default inventoryTransferService;
